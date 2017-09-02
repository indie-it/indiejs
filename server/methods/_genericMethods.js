import { check } from 'meteor/check';

Meteor.methods({

    'getMarkdown'(markdownFile) {
		check(markdownFile, String);
        return Assets.getText(markdownFile);
    }

});