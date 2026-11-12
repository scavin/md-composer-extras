const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");

const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(root, "javascripts/discourse/api-initializers/api-setup.js"), "utf8");
const yaml = fs.readFileSync(path.join(root, "settings.yml"), "utf8");
// Expected public behavior, including the existing left-alignment placeholder.
const formats = [
  ["underline", "underline", "underline_button_title", "[u]", "[/u]", "underline_text", "U"],
  ["strikethrough", "strikethrough", "strikethrough_button_title", "<s>", "</s>", "strikethrough_text"],
  ["superscript", "superscript", "superscript_button_title", "<sup>", "</sup>", "superscript_text"],
  ["subscript", "subscript", "subscript_button_title", "<sub>", "</sub>", "subscript_text"],
  ["align_left", "align-left", "align_left_button_title", '[wrap="left"]\n', "\n[/wrap]", "float_left_text"],
  ["align_center", "align-center", "align_center_button_title", '[wrap="center"]\n', "\n[/wrap]", "align_center_text"],
  ["align_right", "align-right", "align_right_button_title", '[wrap="right"]\n', "\n[/wrap]", "align_right_text"],
  ["align_justify", "align-justify", "align_justify_button_title", '[wrap="justify"]\n', "\n[/wrap]", "align_justify_text"],
  ["highlighter", "highlighter", "highlight_button_title", "<mark>", "</mark>", "highlighter_text", "H"],
  ["columns", "table-columns", "columns_button_title", '[wrap="columns"]\n', "\n[/wrap]", "columns_text"],
  ["float_left", "indent", "float_left_button", '[wrap="floatl"]\n', "\n[/wrap]", "float_left_text"],
];
const key = (format) => `${format[0]}_button_position`;
const defaultPosition = (i) => i < 8 ? "toolbar" : "menu";
const defaults = Object.fromEntries(formats.map((f, i) => [key(f), defaultPosition(i)]));

function localeStrings(locale) {
  const content = fs.readFileSync(path.join(root, `locales/${locale}.yml`), "utf8").split("  js:\n")[1];
  return Object.fromEntries([...content.matchAll(/^    (\w+): (".*")$/gm)].map((m) => [m[1], JSON.parse(m[2])]));
}

function initialize(positions = {}, overrides = {}, locale = "en") {
  const toolbar = [], menu = [], callbacks = [];
  const js = { composer: {} };
  const settings = { ...positions };
  for (const f of formats) {
    settings[`${f[0]}_button`] = `Custom title: ${f[0]}`;
    settings[`${f[0]}_text`] = `Custom text: ${f[0]}`;
  }
  Object.assign(settings, overrides);
  const strings = localeStrings(locale);
  const api = {
    onToolbarCreate(callback) { callbacks.push(callback); },
    addComposerToolbarPopupMenuOption(option) { menu.push(option); },
  };
  vm.runInNewContext(source.replace(/^import .*;\n/gm, "").replace("export default apiInitializer", "apiInitializer"), {
    settings,
    I18n: {
      currentLocale: () => locale,
      translations: { [locale]: { js } },
      t: (key) => {
        assert.ok(Object.hasOwn(strings, key), `missing ${locale} translation: ${key}`);
        return strings[key];
      },
    },
    themePrefix: (key) => key,
    require: () => ({ iconNode: () => {} }),
    apiInitializer: (_version, callback) => callback(api),
  });
  const createToolbar = () => {
    const buttons = [];
    callbacks.forEach((callback) => callback({ addButton: (b) => buttons.push(b) }));
    return buttons;
  };
  toolbar.push(...createToolbar());
  return { toolbar, menu, js, createToolbar };
}

function check(positions, expected) {
  const result = initialize(positions);
  for (const [i, f] of formats.entries()) {
    const [id, icon, title, before, after, placeholder, shortcut] = f;
    const position = expected[i];
    const toolbar = result.toolbar.filter((b) => b.id === `${id}_button`);
    const menu = result.menu.filter((b) => b.label === title);
    assert.equal(toolbar.length, position === "toolbar" ? 1 : 0, `${id}: toolbar`);
    assert.equal(menu.length, position === "menu" ? 1 : 0, `${id}: menu`);
    if (position === "hidden") continue;
    const button = toolbar[0] || menu[0];
    assert.equal(button.icon, icon);
    assert.equal(button.shortcut, shortcut);
    assert.equal(button.title || button.label, title);
    assert.equal(result.js[title], `Custom title: ${id}`);
    const calls = [];
    (button.perform || button.action)({ applySurround: (...args) => calls.push(args) });
    assert.deepEqual(calls, [[before, after, placeholder]]);
    assert.equal(result.js.composer[placeholder], `Custom text: ${placeholder.replace(/_text$/, "")}`);
  }
  assert.equal(result.toolbar.length + result.menu.length, expected.filter((p) => p !== "hidden").length);
  // Recreating a composer must not duplicate menu options or change toolbar controls.
  assert.deepEqual(result.createToolbar().map((b) => b.id), result.toolbar.map((b) => b.id));
}

test("all eleven settings declare the enum and original default", () => {
  assert.equal((yaml.match(/^\w+_button_position:/gm) || []).length, 11);
  for (const [i, f] of formats.entries()) {
    const block = yaml.split(`${key(f)}:\n`)[1].split(/\n\S/)[0];
    assert.match(block, /type: enum/);
    assert.ok(block.includes(`default: ${defaultPosition(i)}`));
    for (const value of ["toolbar", "menu", "hidden"]) assert.ok(block.includes(`- ${value}`));
  }
});
test("missing settings preserve the original eight toolbar and three menu actions", () => check({}, formats.map((_, i) => defaultPosition(i))));
test("declared defaults preserve behavior", () => check(defaults, formats.map((_, i) => defaultPosition(i))));
for (const position of ["toolbar", "menu", "hidden"]) {
  test(`all formats in ${position}`, () => check(Object.fromEntries(formats.map((f) => [key(f), position])), formats.map(() => position)));
  for (const [i, f] of formats.entries()) {
    test(`${f[0]} independently moves to ${position}`, () => {
      const expected = formats.map((_, j) => j === i ? position : defaultPosition(j));
      check({ ...defaults, [key(f)]: position }, expected);
    });
  }
}
test("mixed positions", () => {
  const expected = formats.map((_, i) => ["toolbar", "menu", "hidden"][i % 3]);
  check(Object.fromEntries(formats.map((f, i) => [key(f), expected[i]])), expected);
});
test("invalid settings fall back to original positions", () => {
  for (const value of [null, "", "invalid", false]) check(Object.fromEntries(formats.map((f) => [key(f), value])), formats.map((_, i) => defaultPosition(i)));
});
test("mobile CSS allows the configured justify toolbar button", () => {
  assert.doesNotMatch(fs.readFileSync(path.join(root, "mobile/mobile.scss"), "utf8"), /\.align_justify_button/);
});

for (const locale of ["en", "zh_CN"]) {
  test(`${locale}: stock button titles and placeholders use locale strings`, () => {
    const english = localeStrings("en");
    const strings = localeStrings(locale);
    const overrides = {};
    for (const [id, , title] of formats) {
      overrides[`${id}_button`] = english[title];
      overrides[`${id}_text`] = english[`${id}_text`];
    }
    const result = initialize(defaults, overrides, locale);
    for (const [id, , title] of formats) {
      assert.equal(result.js[title], strings[title]);
      assert.equal(result.js.composer[`${id}_text`], strings[`${id}_text`]);
    }
  });
  test(`${locale}: custom titles and placeholders (including empty text) are preserved`, () => {
    const result = initialize(defaults, { underline_button: "", underline_text: "" }, locale);
    assert.equal(result.js.underline_button_title, "");
    assert.equal(result.js.composer.underline_text, "");
    assert.equal(result.js.highlight_button_title, "Custom title: highlighter");
    assert.equal(result.js.composer.highlighter_text, "Custom text: highlighter");
  });
}
test("English and Simplified Chinese have matching client translation keys", () => {
  assert.deepEqual(Object.keys(localeStrings("en")).sort(), Object.keys(localeStrings("zh_CN")).sort());
  assert.equal(Object.keys(localeStrings("en")).length, 22);
});
