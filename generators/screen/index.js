const Generator = require('yeoman-this');
const {cordova} = require('cordova-lib');

module.exports = class extends Generator {


    async prompting() {

        this.argument('screenName', {type: String, required: true});
    }

    writing() {

        const context = Object.assign({
            module: this.config.get('module'),
            directive: _.kebabCase(this.component),
            _: _s
        }, this.options);
        this.fs.copyTpl(
            this.templatePath('screen.vue'),
            this.destinationPath(`src/views/${this.options.screenName}.vue`),
            context
        );

        const router = this.destinationPath('src/router.js');
        let data;
        let result;

        data = fs.readFileSync(router, 'utf8');
        result =
        fs.writeFileSync(router, data.replace(/([ \t]*)(<!-- add:components js -->)/g, '$1$2\n$1<script src="js/components/' + this.component + '.component.js"></script>');, 'utf8');

        data = fs.readFileSync(componentsSass, 'utf8');
        result = data.replace(/\/\/ add:components/g, "// add:components\n@import '" + this.component + "';");
        fs.writeFileSync(componentsSass, result, 'utf8');

    }
};