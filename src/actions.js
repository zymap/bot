const core = require('@actions/core');
const { Github, context } = require('@actions/github');

async function run() {

    try {
        const github = new Github(process.env.GITHUB_TOKEN);
        const reRunCmd = core.getInput('rerun_cmd', { required: false});
        const owner = core.getInput('repo_owner', {required: true});
        const repo = core.getInput('repo_name', {required: true});
        const comment = await github.issues.getComment({
            owner,
            repo,
            comment_id: context.issue.number
        });
        if (comment.data.body !== reRunCmd) {
            console.log("this is not a bot command");
            return;
        }

        const jobs = await github.checks.listForRef({
            owner,
            repo,
            ref: context.ref,
            status: "completed"
        });

        jobs.data.check_runs.forEach(job => {
            if (job.conclusion === 'failure' || job.conclusion === 'cancelled') {
                console.log("rerun job " + job.name);
                github.checks.rerequestSuite({
                    owner,
                    repo,
                    check_suite_id: job.check_suite.id
                })
            }
        });
    }catch (e) {
        core.setFailed(e);
    }
}

module.exports = run;
