import { apiInitializer } from "discourse/lib/api";
import I18n from "I18n";

async function applyHighlight(element) {
  const highlights = element.querySelectorAll("mark");
  if (!highlights.length) {
    return;
  }
}

// Helper function to get raw text without translation
function getRawText(text) {
  return text.replace(/\[.*?\]/g, '');
}

export default apiInitializer("0.11.1", (api) => {
  const { iconNode } = require("discourse-common/lib/icon-library");
  const currentLocale = I18n.currentLocale();

  // Localize stock text while preserving administrator-supplied titles/placeholders.
  // Keep the existing global keys used by toolbar titles and applySurround.
  const localizedSetting = (name, defaultValue, translationKey) => {
    const value = settings[name];
    return value === undefined || value === defaultValue
      ? I18n.t(themePrefix(translationKey))
      : value;
  };

  // Existing title and composer placeholder keys consumed by the format actions.
  I18n.translations[currentLocale].js.underline_button_title = localizedSetting(
    "underline_button",
    "Underline",
    "underline_button_title",
  );
  I18n.translations[currentLocale].js.align_center_button_title = localizedSetting(
    "align_center_button",
    "Center",
    "align_center_button_title",
  );
  I18n.translations[currentLocale].js.align_right_button_title = localizedSetting(
    "align_right_button",
    "Align right",
    "align_right_button_title",
  );
  I18n.translations[currentLocale].js.align_justify_button_title = localizedSetting(
    "align_justify_button",
    "Justify",
    "align_justify_button_title",
  );
  I18n.translations[currentLocale].js.strikethrough_button_title = localizedSetting(
    "strikethrough_button",
    "Strike-through",
    "strikethrough_button_title",
  );
  I18n.translations[currentLocale].js.superscript_button_title = localizedSetting(
    "superscript_button",
    "Superscript",
    "superscript_button_title",
  );
  I18n.translations[currentLocale].js.subscript_button_title = localizedSetting(
    "subscript_button",
    "Subscript",
    "subscript_button_title",
  );
  I18n.translations[currentLocale].js.columns_button_title = localizedSetting(
    "columns_button",
    "Columns",
    "columns_button_title",
  );
  I18n.translations[currentLocale].js.align_left_button_title = localizedSetting(
    "align_left_button",
    "Align left",
    "align_left_button_title",
  );
  I18n.translations[currentLocale].js.float_left_button = localizedSetting(
    "float_left_button",
    "Float left",
    "float_left_button",
  );
  I18n.translations[currentLocale].js.highlight_button_title = localizedSetting(
    "highlighter_button",
    "Highlighter",
    "highlight_button_title",
  );
  I18n.translations[currentLocale].js.composer.highlighter_text = localizedSetting(
    "highlighter_text",
    "Text",
    "highlighter_text",
  );
  I18n.translations[currentLocale].js.composer.underline_text = localizedSetting(
    "underline_text",
    "Text",
    "underline_text",
  );
  I18n.translations[currentLocale].js.composer.align_center_text = localizedSetting(
    "align_center_text",
    "Text",
    "align_center_text",
  );
  I18n.translations[currentLocale].js.composer.align_left_text = localizedSetting(
    "align_left_text",
    "Text",
    "align_left_text",
  );
  I18n.translations[currentLocale].js.composer.align_right_text = localizedSetting(
    "align_right_text",
    "Text",
    "align_right_text",
  );
  I18n.translations[currentLocale].js.composer.align_justify_text = localizedSetting(
    "align_justify_text",
    "Text",
    "align_justify_text",
  );
  I18n.translations[currentLocale].js.composer.strikethrough_text = localizedSetting(
    "strikethrough_text",
    "Text",
    "strikethrough_text",
  );
  I18n.translations[currentLocale].js.composer.superscript_text = localizedSetting(
    "superscript_text",
    "Text",
    "superscript_text",
  );
  I18n.translations[currentLocale].js.composer.subscript_text = localizedSetting(
    "subscript_text",
    "Text",
    "subscript_text",
  );
  I18n.translations[currentLocale].js.composer.columns_text = localizedSetting(
    "columns_text",
    "Use the closing tag to mark where the first column ends. The second column will autobreak.",
    "columns_text",
  );
  I18n.translations[currentLocale].js.composer.float_left_text = localizedSetting(
    "float_left_text",
    "Text",
    "float_left_text",
  );

  // One definition per format keeps both locations using the same action.
  const buttons = [
    {
      id: "underline_button",
      group: "fontStyles",
      icon: "underline",
      shortcut: "U",
      title: "underline_button_title",
      perform: (e) => e.applySurround("[u]", "[/u]", "underline_text"),
    },
    {
      id: "strikethrough_button",
      group: "fontStyles",
      icon: "strikethrough",
      title: "strikethrough_button_title",
      perform: (e) => e.applySurround("<s>", "</s>", "strikethrough_text"),
    },
    {
      id: "superscript_button",
      group: "fontStyles",
      icon: "superscript",
      title: "superscript_button_title",
      perform: (e) => e.applySurround("<sup>", "</sup>", "superscript_text"),
    },
    {
      id: "subscript_button",
      group: "fontStyles",
      icon: "subscript",
      title: "subscript_button_title",
      perform: (e) => e.applySurround("<sub>", "</sub>", "subscript_text"),
    },
    {
      id: "align_left_button",
      group: "extras",
      icon: "align-left",
      title: "align_left_button_title",
      perform: (e) => e.applySurround('[wrap="left"]\n', "\n[/wrap]", "float_left_text"),
    },
    {
      id: "align_center_button",
      group: "extras",
      icon: "align-center",
      title: "align_center_button_title",
      perform: (e) => e.applySurround('[wrap="center"]\n', "\n[/wrap]", "align_center_text"),
    },
    {
      id: "align_right_button",
      group: "extras",
      icon: "align-right",
      title: "align_right_button_title",
      perform: (e) => e.applySurround('[wrap="right"]\n', "\n[/wrap]", "align_right_text"),
    },
    {
      id: "align_justify_button",
      group: "extras",
      icon: "align-justify",
      title: "align_justify_button_title",
      perform: (e) => e.applySurround('[wrap="justify"]\n', "\n[/wrap]", "align_justify_text"),
    },
    {
      id: "highlighter_button",
      group: "extras",
      icon: "highlighter",
      title: "highlight_button_title",
      shortcut: "H",
      perform: (e) => e.applySurround("<mark>", "</mark>", "highlighter_text"),
      defaultPosition: "menu",
    },
    {
      id: "columns_button",
      group: "extras",
      icon: "table-columns",
      title: "columns_button_title",
      perform: (e) => e.applySurround('[wrap="columns"]\n', "\n[/wrap]", "columns_text"),
      defaultPosition: "menu",
    },
    {
      id: "float_left_button",
      group: "extras",
      icon: "indent",
      title: "float_left_button",
      perform: (e) => e.applySurround('[wrap="floatl"]\n', "\n[/wrap]", "float_left_text"),
      defaultPosition: "menu",
    },
  ].map(({ defaultPosition = "toolbar", ...button }) => {
    const configuredPosition = settings[`${button.id}_position`];
    const position = ["toolbar", "menu", "hidden"].includes(configuredPosition)
      ? configuredPosition
      : defaultPosition;

    return { button, position };
  });

  api.onToolbarCreate((toolbar) => {
    buttons.forEach(({ button, position }) => {
      if (position === "toolbar") {
        toolbar.addButton(button);
      }
    });
  });

  buttons.forEach(({ button, position }) => {
    if (position === "menu") {
      api.addComposerToolbarPopupMenuOption({
        icon: button.icon,
        label: button.title,
        shortcut: button.shortcut,
        action: button.perform,
      });
    }
  });
});
