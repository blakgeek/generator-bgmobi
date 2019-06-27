const Generator = require('yeoman-generator');
const {cordova} = require('cordova-lib');

module.exports = class extends Generator {


    async prompting() {

        this.option('dryrun', {
            type: Boolean, default: false
        });

        Object.assign(this.options, await this.prompt([{
            type: "input",
            name: 'appName',
            message: `What is the app's name?`,
            default: this.appname.replace(/\W+/g, '_')
        }, {
            type: "input",
            name: 'packageName',
            message: `What is the package name?`
        }]));
    }

    createCordovaProject() {

        const {appName, packageName} = this.options;
        cordova.create('.', packageName, appName, {
            lib: {
                www: {
                    template: true,
                    url: this.templatePath('../_cordovaTemplate')
                }
            }
        })
    }

    copyFiles() {
        if(this.fs.exists('~/.blakgeek/build.json')) {
            this.fs.copyFile('~/.blakgeek/build.json', this.destinationPath());
        }
    }

    runNpmInstall() {

        this.spawnCommandSync('npm', ['install']);
    }

    initGit() {

        if(!this.options.noGit) {
            this.spawnCommandSync('git', ['init']);
            if (this.options.gitRepo) this.spawnCommandSync('git', ['remote', 'add', 'origin', this.options.gitRepo + '.git']);
            this.spawnCommandSync('git', ['add', '*']);
        }
    }

    runInitBuild() {

        if (!this.options.skipBuild) {
            this.npmInstall();
            this.spawnCommandSync('npm', ['run','build-local']);
        }
    }
};