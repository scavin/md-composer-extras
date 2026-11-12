# MD Composer Extras

This Discourse theme component adds formatting options to your Discourse composer.

* underline
* strikethrough
* superscript
* subscript
* center
* align left
* align right
* justify
* float left
* columns
* Highlighter

These additions are responsive for desktops and phones, but not for horizon orientation or tablets. These additions have taken into consideration [Slick](https://github.com/discourse/Discourse-Slick-image-gallery), [Tiles](https://github.com/discourse/Discourse-Tiles-image-gallery), and [Events](https://github.com/angusmcleod/discourse-events) when determining what should be placed on the composer bar or in the composer pop out menu.

## Button placement

In the theme component settings, each format has its own `*_button_position` dropdown:

- `toolbar`: show the button directly on the composer toolbar.
- `menu`: show the button in the **+ / options** popup menu.
- `hidden`: do not register the button or its keyboard shortcut.

These settings apply to both desktop and mobile. They control the editing controls, not whether existing formatted posts render. After saving settings, reload the page to rebuild the composer controls. Existing button-title and placeholder-text settings still apply in either location. Icons, formatting actions, and shortcuts (Ctrl/Meta+U for underline and Ctrl/Meta+H for highlighter) are preserved when moving a button.

| Setting | Default |
| --- | --- |
| `underline_button_position` | `toolbar` |
| `strikethrough_button_position` | `toolbar` |
| `superscript_button_position` | `toolbar` |
| `subscript_button_position` | `toolbar` |
| `align_left_button_position` | `toolbar` |
| `align_center_button_position` | `toolbar` |
| `align_right_button_position` | `toolbar` |
| `align_justify_button_position` | `toolbar` |
| `highlighter_button_position` | `menu` |
| `columns_button_position` | `menu` |
| `float_left_button_position` | `menu` |

Defaults preserve the original eight toolbar buttons and three menu options. Missing or invalid position values also fall back to those defaults. On mobile, justify now follows its position setting instead of being forcibly hidden by CSS. Placing many buttons on the toolbar may crowd narrow screens; move less-used formats to the menu.

## Languages / 语言

English and Simplified Chinese (`zh_CN`) are included for setting descriptions, position choices, default button titles, and placeholder text. The interface follows the current Discourse locale. Administrators' custom titles and placeholders are kept; values equal to the original English defaults use the locale translation. The underlying position values remain `toolbar`, `menu`, and `hidden`. On older Discourse versions without translated enum labels, these raw values may still appear.

支持英文和简体中文：设置说明、位置选项、默认按钮标题和占位文本会跟随 Discourse 当前语言。自定义标题和占位文本会保留；与原英文默认值相同的内容会显示对应翻译。简体中文位置选项为“工具栏”“+ 选项菜单”“隐藏”。

更新组件后，刷新管理页面，在组件设置中搜索 `button position` 或 `position`。11 个位置设置位于原有文案和图标设置之后。如果仍然看不到，请核对组件来源为 `scavin/md-composer-extras`、分支为 `main`，并确认已更新组件。

## Checks

Run the dependency-free registration and formatting regression checks with Node.js 18 or newer:

```sh
node --test tests/button-placement.test.cjs
```

These checks exercise all positions, mixed settings, defaults, custom text, and unchanged formatting actions and shortcuts. A live Discourse desktop/mobile check is still recommended before deployment; the checks do not render the composer.

For browser layout checks, serve the repository root (for example, `python3 -m http.server 8765 --bind 127.0.0.1`) and open `http://127.0.0.1:8765/tests/columns-preview.html`. The fixture reads the component styles and checks title alignment, right-hand text containment at four preview widths, unchanged posted paragraph geometry, ordinary previews, and mobile stacking. It uses standalone markup matching the Markdown output and does not replace a live Discourse check.


## Columns and Floats

When using columns and floats, note that the text will autobreak once an appropriate amount of content has been placed in the second column or to the side of the float.

Columns have a CSS border to for ease of viewing.

Desktop Markdown previews normalize paragraph spacing inside the left column and keep each following right-hand paragraph in its own formatting context. This aligns titles and prevents a long paragraph from wrapping back underneath the left column. Posted content and the mobile single-column layout keep their existing styles. The syntax still uses a float: later blocks may return to full width after the left column ends; it is not a fixed two-column grid.

A column is broken by placing `[/wrap]` at the end of the first column's content.

The CSS for columns and floats is disabled on mobile. By default on mobile columns and float will appear as single column content. The missing CSS can be added in again manually.

**Column Example**

Place the following in your editor to see how columns work.

```
Test

[wrap="columns"]
1
2
3
[/wrap]
1
2
3

Test
```

## Questions

For more informations, see: 

- English : https://meta.discourse.org/t/md-composer-extras/118912
- Français : https://www.mon-discourse.fr/themes/md-composer-extras/

## Credits

Wrap support by thw26: https://github.com/thw26

<br>

I took some parts of the Iconified Header Links and Slick Image Gallery theme components made by Johani : 

https://meta.discourse.org/t/iconified-header-links/86307 (adding fa5 icons in the theme component)
https://meta.discourse.org/t/slick-image-gallery/81952 (manager the translations inside the theme component)
