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

## Checks

Run the dependency-free registration and formatting regression checks with Node.js 18 or newer:

```sh
node --test tests/button-placement.test.cjs
```

These checks exercise all positions, mixed settings, defaults, custom text, and unchanged formatting actions and shortcuts. A live Discourse desktop/mobile check is still recommended before deployment; the checks do not render the composer.


## Columns and Floats

When using columns and floats, note that the text will autobreak once an appropriate amount of content has been placed in the second column or to the side of the float.

Columns have a CSS border to for ease of viewing.

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
