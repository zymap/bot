# Github Action - CI bot

This GitHub Action (written in JavaScript) wraps the [GitHub API](https://developer.github.com/v3/), 
to allow you to leverage GitHub Actions to rerun you failure checks in PR.

## Usage

### Pre-requisites

Create a workflow `.yml` file in your `.github/workflows` directory. An example workflow is available below. For more
information, reference the Github Help Documentation for [Creating a workflow file](https://help.github.com/en/articles/configuring-a-workflow#creating-a-workflow-file).

### Inputs

- `repo_owner`: The owner of the repository
- `repo_name`: The name of the repository
- `rerun_cmd`: The commands string to rerun all failure checks
- `comments`: The comments string of the PR

### Example workflow

On every `issue_comment` created to the pull request matching the `rerun_cmd`.

```yaml
on:
  issue_comment:
    types: [created]

jobs:
  bot:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Bot actions
        uses: zymap/bot@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          repo_owner: zymap  # replace here to your repo owner
          repo_name: bot     # replace here to your repo name
          rerun_cmd: rerun failure checks
          comment: ${{ github.event.comment.body }}
```
