/**
 * islyngten - JavaScript library supplying I18N translation support for Node.js and the browser.
 *
 * @copyright: Copyright (c) 2013-present, tbillenstein
 *
 * @author: tbillenstein <tb@thomasbillenstein.com> (https://thomasbillenstein.com)
 *
 * @license This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


var Islyngten = Islyngten || require('../islyngten');

describe("Islyngten", function()
{
	it("should add resources and return a valid resource bundle.", function()
	{
		const i18n = new Islyngten();

		i18n.resources('dingdong', 'en', {
			"hund": "dog",
			"katze": "cat",
			"maus": "mouse"
		});

		const rb = i18n.resourceBundle('dingdong', 'en');

		expect(rb).not.toBeNull();
		expect(rb).toBeDefined();
		expect(rb.context()).toBe('dingdong');
		expect(rb.locale()).toBe('en');

		// ResourceBundle (rb) translates as expected.
		expect(rb.get("hund")).toBe("dog");
		expect(rb.get("katze")).toBe("cat");
		expect(rb.get("maus")).toBe("mouse");
	});

	it("should return an 'empty' resource bundle for undefined locales.", function()
	{
		const i18n = new Islyngten();

		i18n.resources('dingdong', 'en', {
			"hund": "dog",
			"katze": "cat",
			"maus": "mouse"
		});

		const rb = i18n.resourceBundle('dingdong', 'jp');

		expect(rb).not.toBeNull();
		expect(rb).toBeDefined();
		expect(rb.context()).toBe('dingdong');
		expect(rb.locale()).toBe('jp');

		// No translation since there are no resources (translations) for locale 'jp'.
		expect(rb.get("hund")).toBe("hund");
		expect(rb.get("katze")).toBe("katze");
		expect(rb.get("maus")).toBe("maus");
	});

	it("should return an 'empty' resource bundle for undefined contexts.", function()
	{
		const i18n = new Islyngten();

		i18n.resources('dingdong', 'en', {
			"hund": "dog",
			"katze": "cat",
			"maus": "mouse"
		});

		const rb = i18n.resourceBundle('blahblah', 'en');

		expect(rb).not.toBeNull();
		expect(rb).toBeDefined();
		expect(rb.context()).toBe('blahblah');
		expect(rb.locale()).toBe('en');

		// No translation since there are no resources (translations) in context 'blahblah'.
		expect(rb.get("hund")).toBe("hund");
		expect(rb.get("katze")).toBe("katze");
		expect(rb.get("maus")).toBe("maus");
	});

	it("should handle multiple locales.", function()
	{
		const i18n = new Islyngten();

		i18n.resources('dingdong', 'en', {
			"hund": "dog",
			"katze": "cat",
			"maus": "mouse"
		});

		i18n.resources('dingdong', 'fr', {
			"hund": "chien",
			"katze": "chat",
			"maus": "souris"
		});

		// ResourceBundle (rb) returns 'en' translations.
		var rb = i18n.resourceBundle('dingdong', 'en');

		expect(rb.context()).toBe('dingdong');
		expect(rb.locale()).toBe('en');
		expect(rb.get("hund")).toBe("dog");
		expect(rb.get("katze")).toBe("cat");
		expect(rb.get("maus")).toBe("mouse");

		// ResourceBundle (rb) returns 'fr' translations.
		rb = i18n.resourceBundle('dingdong', 'fr');

		expect(rb.context()).toBe('dingdong');
		expect(rb.locale()).toBe('fr');
		expect(rb.get("hund")).toBe("chien");
		expect(rb.get("katze")).toBe("chat");
		expect(rb.get("maus")).toBe("souris");
	});

	it("should handle multiple contexts.", function()
	{
		const i18n = new Islyngten();

		i18n.resources('dingdong', 'en', {
			"hund": "dingdong-dog"
		});

		i18n.resources('blahblah', 'en', {
			"hund": "blahblah-dog"
		});

		// ResourceBundle (rb) returns 'en' translations in 'dingdong' context.
		var rb = i18n.resourceBundle('dingdong', 'en');

		expect(rb.context()).toBe('dingdong');
		expect(rb.locale()).toBe('en');
		expect(rb.get("hund")).toBe("dingdong-dog");

		// ResourceBundle (rb) returns 'en' translations in 'blahblah' context.
		rb = i18n.resourceBundle('blahblah', 'en');

		expect(rb.context()).toBe('blahblah');
		expect(rb.locale()).toBe('en');
		expect(rb.get("hund")).toBe("blahblah-dog");
	});

	it("should translate singular text.", function()
	{
		const i18n = new Islyngten();

		i18n.resources('dingdong', 'en', {
			"hund": "dog",
			"katze": "cat",
			"maus": "mouse"
		});

		const rb = i18n.resourceBundle('dingdong', 'en');

		expect(rb._("hund")).toBe("dog");
		expect(rb._("elefant")).toBe("elefant");
	});

	it("should translate singular text in undefined locales.", function()
	{
		const i18n = new Islyngten();

		i18n.resources('dingdong', 'en', {
			"hund": "dog",
			"katze": "cat",
			"maus": "mouse"
		});

		const rb = i18n.resourceBundle('dingdong', 'jp');

		expect(rb._("hund")).toBe("hund");
		expect(rb._("katze")).toBe("katze");
		expect(rb._("maus")).toBe("maus");
		expect(rb._("elefant")).toBe("elefant");
	});

	it("should translate singular text in undefined contexts.", function()
	{
		const i18n = new Islyngten();

		i18n.resources('dingdong', 'en', {
			"hund": "dog",
			"katze": "cat",
			"maus": "mouse"
		});

		const rb = i18n.resourceBundle('blahblah', 'en');

		// t() is alias for get() and _().
		expect(rb.t("hund")).toBe("hund");
		expect(rb.t("katze")).toBe("katze");
		expect(rb.t("maus")).toBe("maus");
		expect(rb.t("elefant")).toBe("elefant");
	});

	it ("should translate plural text.", function()
	{
		const i18n = new Islyngten();

		i18n.resources('dingdong', 'de', {
		  "Delete the selected file?": "Selektierte Datei entfernen?",
		  "Delete the selected files?": "Selektierte Dateien entfernen?"
		});
		
		var rb = i18n.resourceBundle('dingdong', 'de');
		
		var fileCount = 1;
		var translation = rb.__("Delete the selected file?", "Delete the selected files?", fileCount);
		expect(translation).toBe("Selektierte Datei entfernen?");
		
		fileCount = 4;
		translation = rb.__("Delete the selected file?", "Delete the selected files?", fileCount);
		expect(translation).toBe("Selektierte Dateien entfernen?");
	});

	it("should translate plural text with variables.", function()
	{
		const i18n = new Islyngten();

		i18n.resources('dingdong', 'de', {
			"The list contains $count item": "Die Liste enth&auml;lt $count Eintrag",
			"The list contains $count items": "Die Liste enth&auml;lt $count Eintr&auml;ge"
		});

		const rb = i18n.resourceBundle('dingdong', 'de');

		var count = 0;
		var translation = rb.__("The list contains $count item", "The list contains $count items", count, {
			'$count': count
		});
		expect(translation).toBe("Die Liste enth&auml;lt 0 Eintr&auml;ge");

		count = 1;
		translation = rb.nget("The list contains $count item", "The list contains $count items", count, {
			'$count': count
		});
		expect(translation).toBe("Die Liste enth&auml;lt 1 Eintrag");

		// tt() is alias for nget() and __().
		count = 12;
		translation = rb.tt("The list contains $count item", "The list contains $count items", count, {
			'$count': count
		});
		expect(translation).toBe("Die Liste enth&auml;lt 12 Eintr&auml;ge");
	});

	it("should translate multiple plural text", function () 
	{
		const i18n = new Islyngten();

		i18n.resources('multi', 'pl', {
			"file": "plik",
			"files": {
				'2,3,4': "pliki",
				'5-21': "plików",
				'22-24': "pliki",
				'25-31': "plików"
			}
		});
		
		const rb = i18n.resourceBundle('multi', 'pl');
		
		var translation = rb.__("file", "files", 1);
		expect(translation).toBe("plik");
		
		translation = rb.__("file", "files", 2);
		expect(translation).toBe("pliki");
		
		translation = rb.__("file", "files", 3);
		expect(translation).toBe("pliki");
		
		translation = rb.__("file", "files", 4);
		expect(translation).toBe("pliki");
		
		translation = rb.__("file", "files", 5);
		expect(translation).toBe("plików");
		
		translation = rb.__("file", "files", 6);
		expect(translation).toBe("plików");
		
		translation = rb.__("file", "files", 20);
		expect(translation).toBe("plików");
		
		translation = rb.__("file", "files", 23);
		expect(translation).toBe("pliki");
		
		translation = rb.__("file", "files", 30);
		expect(translation).toBe("plików");
	});

	it("should translate multiple plural text.", function()
	{
		const i18n = new Islyngten();

		i18n.resources('dingdong', 'de', {
			"apple": "a",
			"apples": {
				'0': '/a',
				'2': 'aa',
				'3-6': 'aaa',
				'9,11,13': 'bc',
				'<8': 'cccccccc',
				'<=10': 'dddddddddd',
				'>14': 'aaaaaaaa',
				'>=8': 'bbbbbbbbbbbb'
			}
		});

		const rb = i18n.resourceBundle('dingdong', 'de');

		var count = 0;
		var translation = rb.__("apple", "apples", count);
		expect(translation).toBe("/a");

		count = 1;
		translation = rb.__("apple", "apples", count);
		expect(translation).toBe("a");

		count = 2;
		translation = rb.__("apple", "apples", count);
		expect(translation).toBe("aa");

		count = 3;
		translation = rb.__("apple", "apples", count);
		expect(translation).toBe("aaa");

		count = 4;
		translation = rb.__("apple", "apples", count);
		expect(translation).toBe("aaa");

		count = 5;
		translation = rb.__("apple", "apples", count);
		expect(translation).toBe("aaa");

		count = 6;
		translation = rb.__("apple", "apples", count);
		expect(translation).toBe("aaa");

		count = 7;
		translation = rb.__("apple", "apples", count);
		expect(translation).toBe("cccccccc");

		count = 8;
		translation = rb.__("apple", "apples", count);
		expect(translation).toBe("dddddddddd");

		count = 9;
		translation = rb.__("apple", "apples", count);
		expect(translation).toBe("bc");

		count = 10;
		translation = rb.__("apple", "apples", count);
		expect(translation).toBe("dddddddddd");

		count = 11;
		translation = rb.__("apple", "apples", count);
		expect(translation).toBe("bc");

		count = 12;
		translation = rb.__("apple", "apples", count);
		expect(translation).toBe("bbbbbbbbbbbb");

		count = 13;
		translation = rb.__("apple", "apples", count);
		expect(translation).toBe("bc");

		count = 14;
		translation = rb.__("apple", "apples", count);
		expect(translation).toBe("bbbbbbbbbbbb");

		count = 15;
		translation = rb.__("apple", "apples", count);
		expect(translation).toBe("aaaaaaaa");
	});

	it("should handle interpolation.", function ()
	{
		const i18n = new Islyngten();

		i18n.resources('dingdong', 'de', {
			"Height must be within {{arg0}} and {{arg1}} cm.": "H&ouml;he muss innerhalb von {{arg0}} und {{arg1}} cm liegen."
		});

		const rb = i18n.resourceBundle('dingdong', 'de');
		const translation = rb._("Height must be within {{arg0}} and {{arg1}} cm.", {
			'{{arg0}}': "120",
			'{{arg1}}': "250"
		});

		expect(translation).toBe("H&ouml;he muss innerhalb von 120 und 250 cm liegen.");
	});

	it("should work as expected in standard workflows.", function()
	{
		const i18n = new Islyngten();

		i18n.resources('myapp', 'de', {
			"Do you really want to delete the file {{filename}}?": 
				"Wollen Sie die Datei {{filename}} wirklich l&ouml;schen?"
		});

		i18n.resources('myapp', 'fr', {
			"Do you really want to delete the file {{filename}}?": 
				"Voulez-vous vraiment supprimer le fichier {{filename}}?"
		});

		var rb = i18n.resourceBundle('myapp', 'en');
		var translation = rb._("Do you really want to delete the file {{filename}}?", {
			'{{filename}}': "test.txt"
		});

		expect(translation).toBe("Do you really want to delete the file test.txt?");

		rb = i18n.resourceBundle('myapp', 'de');
		translation = rb._("Do you really want to delete the file {{filename}}?", {
			'{{filename}}': "test.txt"
		});

		expect(translation).toBe("Wollen Sie die Datei test.txt wirklich l&ouml;schen?");

		rb = i18n.resourceBundle('myapp', 'fr');
		translation = rb._("Do you really want to delete the file {{filename}}?", {
			'{{filename}}': "test.txt"
		});

		expect(translation).toBe("Voulez-vous vraiment supprimer le fichier test.txt?");
	});
});
