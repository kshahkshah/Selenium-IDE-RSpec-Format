/*
 * Format for Selenium Remote Control RSpec client.
 *
 * Originally from a post on David Christian's blog:
 * http://www.techdarkside.com/generating-rspec-tests-with-selenium-ide
 *
 * Updated as per my comment on that blog
 */

load('remoteControl.js');

this.name = "ruby-rc";

function testMethodName(testName) {
	return "test_" + underscore(testName);
}

function assertTrue(expression) {
	return expression.toString() + ".should be_true";
}

function assertFalse(expression) {
	return expression.invert().toString() + ".should be_false";
}

function verify(statement) {
	return statement
}

function verifyTrue(expression) {
	return verify(assertTrue(expression));
}

function verifyFalse(expression) {
	return verify(assertFalse(expression));
}

function assignToVariable(type, variable, expression) {
	return variable + " = " + expression.toString();
}

function waitFor(expression) {
	if (expression.negative) {
		return "assert !60.times{ break unless (" + expression.invert().toString() + " rescue true); sleep 1 }"
	} else {
		return "assert !60.times{ break if (" + expression.toString() + " rescue false); sleep 1 }"
	}
}

function assertOrVerifyFailure(line, isAssert) {
	return "assert_raise(Kernel) { " + line + "}";
}

Equals.prototype.toString = function() {
	return this.e1.toString() + " == " + this.e2.toString();
}

Equals.prototype.assert = function() {
	return "assert_equal " + this.e1.toString() + ", " + this.e2.toString();
}

Equals.prototype.verify = function() {
	return verify(this.assert());
}

NotEquals.prototype.toString = function() {
	return this.e1.toString() + " != " + this.e2.toString();
}

NotEquals.prototype.assert = function() {
	return "assert_not_equal " + this.e1.toString() + ", " + this.e2.toString();
}

NotEquals.prototype.verify = function() {
	return verify(this.assert());
}

RegexpMatch.prototype.toString = function() {
	return "/" + this.pattern.replace(/\//g, "\\/") + "/ =~ " + this.expression;
}

RegexpNotMatch.prototype.toString = function() {
	return "/" + this.pattern.replace(/\//g, "\\/") + "/ !~ " + this.expression;
}

seleniumEquals.useUniqueVariableForAssertion = false;

seleniumEquals.prototype.length = function() {
	return this.variableName + ".size";
}

seleniumEquals.prototype.item = function(index) {
	return this.variableName + "[" + index + "]";
}

function pause(milliseconds) {
	return "sleep " + (parseInt(milliseconds) / 1000);
}

function echo(message) {
	return "p " + xlateArgument(message);
}

function statement(expression) {
	expression.noBraces = true;
	return expression.toString();
}

function array(value) {
	var str = '[';
	for (var i = 0; i < value.length; i++) {
		str += string(value[i]);
		if (i < value.length - 1) str += ", ";
	}
	str += ']';
	return str;
}

CallSelenium.prototype.toString = function() {
	var result = '';
	if (this.negative) {
		result += '!';
	}
	if (options.receiver) {
		result += options.receiver + '.';
	}
	result += underscore(this.message);
	if (!this.noBraces && this.args.length > 0) {
		result += '(';
	} else if (this.args.length > 0) {
		result += ' ';
	}
	for (var i = 0; i < this.args.length; i++) {
		result += this.args[i];
		if (i < this.args.length - 1) {
			result += ', ';
		}
	}
	if (!this.noBraces && this.args.length > 0) {
		result += ')';
	}
	return result;
}

function formatComment(comment) {
	return comment.comment.replace(/.+/mg, function(str) {
			return "# " + str;
		});
}

this.options = {
	receiver: "@selenium_driver",
	header: 
		'require File.dirname(__FILE__) + \'/spec_helper\' ' +
		'\n' +
		'describe "${className}" do ' +
        '\n' +
		'  before(:each) do' +
        '\n' +
		'    #put any setup tasks here' +
        '\n' +
		'  end' +
        '\n' +
		'  it \"describe what this thing should do here\" do ' +
                '\n',
	footer:
		"  end\nend\n",
	indent: "2",
	initialIndents: "2"
};

this.configForm = 
	'<description>Variable for Selenium instance</description>' +
	'<textbox id="options_receiver" />' +
	'<description>Header</description>' +
	'<textbox id="options_header" multiline="true" flex="1" rows="4"/>' +
	'<description>Footer</description>' +
	'<textbox id="options_footer" multiline="true" flex="1" rows="4"/>' +
	'<description>Indent</description>' +
	'<menulist id="options_indent"><menupopup>' +
	'<menuitem label="Tab" value="tab"/>' +
	'<menuitem label="1 space" value="1"/>' +
	'<menuitem label="2 spaces" value="2"/>' +
	'<menuitem label="3 spaces" value="3"/>' +
	'<menuitem label="4 spaces" value="4"/>' +
	'<menuitem label="5 spaces" value="5"/>' +
	'<menuitem label="6 spaces" value="6"/>' +
	'<menuitem label="7 spaces" value="7"/>' +
	'<menuitem label="8 spaces" value="8"/>' +
	'</menupopup></menulist>';