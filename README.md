# track-changed
Track files changed by git

Shamefully ripped off and based on Andrey Okonetchnikov's [lint-staged](https://github.com/okonet/lint-staged)

Automagically fire tasks on branch change, merge and rebase if tracked files was changed.
E.g. suitable for re-installing deps on changed lock-files.

Use [husky](https://github.com/typicode/husky) to manage git hooks.

```
"scripts": {
  // ...
  "precommit": "lint-staged",
  "postcheckout": "track-changed checkout",
  "postmerge": "track-changed merge",
  "postrewrite": "track-changed rewrite"
},
"devDependencies": {
  // ...
  "husky": "^0.13.1"
},
"track-changed": {
  "yarn.lock": "yarn",
  "npm-shrinkwrap.json": "npm prune && npm install",
  "bower.json": "bower prune && bower install",
  "Gemfile.*": "bundle install"
},
"lint-staged": {
  "*.js": [
    "eslint --fix",
    "git add"
  ]
}
```
