const core = require('@actions/core');
const { GitHub, context } = require('@actions/github');

async function run() {

    try {
        const github = new GitHub(process.env.GITHUB_TOKEN);
        const reRunCmd = core.getInput('rerun_cmd', { required: false});
        const owner = core.getInput('repo_owner', {required: true});
        const repo = core.getInput('repo_name', {required: true});
        const comment = core.getInput('comment', {required: true});

        if ( comment !== reRunCmd) {
            console.log("this is not a bot command");
            return;
        }

        const {
            data: {
                head: {
                    sha: prRef,
                }
            }
        } = await github.pulls.get({
            owner,
            repo,
            pull_number: context.issue.number,
        });

        const jobs = await github.checks.listForRef({
            owner,
            repo,
            ref: prRef,
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
