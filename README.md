# Comment Docs Test

A playground to test out comment-docs.


## Getting started

### Installing dependencies (one time)

Install [node.js](http://nodejs.org/) however you'd like.

Then Install [Grunt](http://gruntjs.com/) and [Bower](http://bower.io/):
```bash
$ npm install -g grunt-cli bower
```

### Developing

Each time you fetch from upstream, install dependencies with npm and run `grunt`
to build everything:
```bash
$ npm install
$ grunt
```

_Note that you'll get the following error:_
```bash
Warning: Error converting comment #4 to YAML. Please check for formatting errors. Use --force to continue.
```

This is because there are some Less commented Comment Doc comments in
vendor/cf-concat/cf.less at the fourth comment doc. Delete those and re-run
`grunt vendor` then `grunt`. This is an issue with Comment Docs that needs to be
fixed.

## Getting involved

We welcome your feedback and contributions.
Please read [CONTRIBUTING](CONTRIBUTING.md).

To file a bug please us this handy [template](https://github.com/cfpb/comment-docs-test/issues/new?body=%23%23%20URL%0D%0D%0D%23%23%20Actual%20Behavior%0D%0D%0D%23%23%20Expected%20Behavior%0D%0D%0D%23%23%20Steps%20to%20Reproduce%0D%0D%0D%23%23%20Screenshot&labels=bug).

----

## Open source licensing info
1. [TERMS](TERMS.md)
2. [LICENSE](LICENSE)
3. [CFPB Source Code Policy](https://github.com/cfpb/source-code-policy/)
