# Tracker App Server

### Purpose
This is the Backend for a prototype app for recording and tracking potential disaster/other related issues on a map.

## To run tests locally
Add the following script to your bash shell and then run the following command:
```zsh
test () {
	npx mocha --require @babel/register --require @babel/polyfill --exit $1
}
```

```zsh
test src/tests
```

