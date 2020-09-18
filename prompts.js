module.exports = [
  {
    type: 'list',
    name: 'version',
    message: 'Choose the electron version',
    choices: [
      { name: 'electron 5', value: '5' },
      { name: 'electron 6', value: '6' },
      { name: 'electron 7', value: '7' },
      { name: 'electron 8', value: '8' },
      { name: 'electron 9', value: '9' },
      { name: 'electron 10', value: '10' }
    ],
    default: '10'
  },
  {
    type: 'confirm',
    name: 'rebuild',
    message: 'Do you want to use electron-rebuild to rebuild native-node-module?',
    default: true
  },
  {
    type: 'confirm',
    name: 'twoPkgFlag',
    message: 'Use two package.json?',
    default: false
  },
  {
    when: answers => answers.twoPkgFlag === true,
    type: 'input',
    name: 'twoPkgPath',
    message: 'What\'s your second package.json path(Use in production)',
    default: 'app'
  }
]
