var jasmine = require('jasmine'),
    SpecReporter = require('jasmine-spec-reporter');

var jm = new jasmine();

jm.loadConfigFile('./spec/support/jasmine.json');

jm.configureDefaultReporter({
                print: function () {}

        });

        jm.addReporter(new SpecReporter());
        jm.execute();
