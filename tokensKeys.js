const tokensKeys = [
    // Global font
    "font-size",
    "line-height",
    "font-weight",
    "letter-spacing",
    // Global size
    "gap-size",
    "icon-size",
    // Global transition
    "table-transition",
    // Global color
    "border-color",
    "accent-color",
    "foreground-color",
    "background-color",
    "placeholder-color",
    "read-only-color",
    "disabled-color",

    // Border
    "cell-horizontal-border-color",
    "cell-vertical-border-color",

    // Wrapper
    "wrapper-border-width",
    "wrapper-border-radius",
    "wrapper-border-color",

    // Row odd and even
    "row-header-odd-background-color",
    "row-header-even-background-color",
    "row-cell-odd-background-color",
    "row-cell-even-background-color",

    // Cell padding
    "cell-horizontal-padding",
    "cell-vertical-padding",

    // Cell editor
    "cell-editor-border-width",
    "cell-editor-border-color",
    "cell-editor-foreground-color",
    "cell-editor-background-color",
    "cell-editor-shadow-blur-radius",
    "cell-editor-shadow-color",

    // Cell state
    "cell-success-background-color",
    "cell-error-background-color",

    // Cell selection
    "cell-selection-border-color",
    "cell-selection-background-color",

    // Cell autofill
    "cell-autofill-size",
    "cell-autofill-background-color",
    "cell-autofill-fill-border-color",

    // Cell mobile handle
    "cell-mobile-handle-size",
    "cell-mobile-handle-border-width",
    "cell-mobile-handle-border-radius",
    "cell-mobile-handle-border-color",
    "cell-mobile-handle-background-color",

    // Resize indicator
    "resize-indicator-color",

    // Move
    "move-backlight-color",
    "move-indicator-color",

    // Hidden indicator 
    "hidden-indicator-color",

    // Scrollbar
    "scrollbar-border-radius",
    "scrollbar-track-color",
    "scrollbar-thumb-color",

    // Header
    "header-font-weight",
    "header-foreground-color",
    "header-background-color",
    // Header highlighted
    "header-highlighted-shadow-size",
    "header-highlighted-foreground-color",
    "header-highlighted-background-color",
    // Header active
    "header-active-border-color",
    "header-active-foreground-color",
    "header-active-background-color",
    // Header filter
    "header-filter-background-color",

    // Header row
    "header-row-foreground-color",
    "header-row-background-color",
    // Header row highlighted
    "header-row-highlighted-foreground-color",
    "header-row-highlighted-background-color",
    // Header row active
    "header-row-active-foreground-color",
    "header-row-active-background-color",

    // Checkbox
    "checkbox-size",
    "checkbox-border-radius",
    "checkbox-border-color",
    "checkbox-background-color",
    "checkbox-icon-color",
    // Checkbox focus
    "checkbox-focus-border-color",
    "checkbox-focus-background-color",
    "checkbox-focus-icon-color",
    "checkbox-focus-ring-color",
    // Checkbox disabled
    "checkbox-disabled-border-color",
    "checkbox-disabled-background-color",
    "checkbox-disabled-icon-color",
    // Checkbox checked
    "checkbox-checked-border-color",
    "checkbox-checked-background-color",
    "checkbox-checked-icon-color",
    // Checkbox checked focus
    "checkbox-checked-focus-border-color",
    "checkbox-checked-focus-background-color",
    "checkbox-checked-focus-icon-color",
    // Checkbox checked disabled
    "checkbox-checked-disabled-border-color",
    "checkbox-checked-disabled-background-color",
    "checkbox-checked-disabled-icon-color",
    // Checkbox indeterminate 
    "checkbox-indeterminate-border-color",
    "checkbox-indeterminate-background-color",
    "checkbox-indeterminate-icon-color",
    // Checkbox indeterminate focus
    "checkbox-indeterminate-focus-border-color",
    "checkbox-indeterminate-focus-background-color",
    "checkbox-indeterminate-focus-icon-color",
    // Checkbox indeterminate disabled
    "checkbox-indeterminate-disabled-border-color",
    "checkbox-indeterminate-disabled-background-color",
    "checkbox-indeterminate-disabled-icon-color",

    // Radio
    "radio-size",
    "radio-border-radius",
    "radio-border-color",
    "radio-background-color",
    "radio-icon-color",
    // Radio focus
    "radio-focus-border-color",
    "radio-focus-background-color",
    "radio-focus-icon-color",
    "radio-focus-ring-color",
    // Radio disabled
    "radio-disabled-border-color",
    "radio-disabled-background-color",
    "radio-disabled-icon-color",
    // Radio checked
    "radio-checked-border-color",
    "radio-checked-background-color",
    "radio-checked-icon-color",
    // Radio checked focus
    "radio-checked-focus-border-color",
    "radio-checked-focus-background-color",
    "radio-checked-focus-icon-color",
    // Radio checked disabled
    "radio-checked-disabled-border-color",
    "radio-checked-disabled-background-color",
    "radio-checked-disabled-icon-color",

    // Icon Button
    "icon-button-border-radius",
    "icon-button-border-color",
    "icon-button-background-color",
    "icon-button-icon-color",
    // Icon Button hover
    "icon-button-hover-border-color",
    "icon-button-hover-background-color",
    "icon-button-hover-icon-color",
    
    // Icon Button active new version
    "icon-button-active-border-color",
    "icon-button-active-background-color",
    "icon-button-active-icon-color",
    // Icon Button active hover 
    "icon-button-active-hover-border-color",
    "icon-button-active-hover-background-color",
    "icon-button-active-hover-icon-color",
    // Icon Button active
    "icon-active-button-border-color",
    "icon-active-button-background-color",
    "icon-active-button-icon-color",
    // Icon Button active hover
    "icon-active-button-hover-border-color",
    "icon-active-button-hover-background-color",
    "icon-active-button-hover-icon-color",

    // Collapse button
    "collapse-button-border-radius",
    // Collapse button open
    "collapse-button-open-border-color",
    "collapse-button-open-background-color",
    "collapse-button-open-icon-color",
    "collapse-button-open-icon-active-color",
    // Collapse button open hover
    "collapse-button-open-hover-border-color",
    "collapse-button-open-hover-background-color",
    "collapse-button-open-hover-icon-color",
    "collapse-button-open-hover-icon-active-color",
    // Collapse button close
    "collapse-button-close-border-color",
    "collapse-button-close-background-color",
    "collapse-button-close-icon-color",
    "collapse-button-close-icon-active-color",
    // Collapse button close hover
    "collapse-button-close-hover-border-color",
    "collapse-button-close-hover-background-color",
    "collapse-button-close-hover-icon-color",
    "collapse-button-close-hover-icon-active-color",

    // Button
    "button-border-radius",
    "button-horizontal-padding",
    "button-vertical-padding",
    // Button primary
    "primary-button-border-color",
    "primary-button-foreground-color",
    "primary-button-background-color",
    // Button primary disabled
    "primary-button-disabled-border-color",
    "primary-button-disabled-foreground-color",
    "primary-button-disabled-background-color",
    // Button primary hover
    "primary-button-hover-border-color",
    "primary-button-hover-foreground-color",
    "primary-button-hover-background-color",
    // Button primary focus
    "primary-button-focus-border-color",
    "primary-button-focus-foreground-color",
    "primary-button-focus-background-color",
    // Button secondary
    "secondary-button-border-color",
    "secondary-button-foreground-color",
    "secondary-button-background-color",
    // Button secondary disabled
    "secondary-button-disabled-border-color",
    "secondary-button-disabled-foreground-color",
    "secondary-button-disabled-background-color",
    // Button secondary hover
    "secondary-button-hover-border-color",
    "secondary-button-hover-foreground-color",
    "secondary-button-hover-background-color",
    // Button secondary focus
    "secondary-button-focus-border-color",
    "secondary-button-focus-foreground-color",
    "secondary-button-focus-background-color",

    // Comments
    "comments-textarea-horizontal-padding",
    "comments-textarea-vertical-padding",
    "comments-textarea-border-width",
    "comments-textarea-border-color",
    "comments-textarea-foreground-color",
    "comments-textarea-background-color",
    // Comments focus
    "comments-textarea-focus-border-width",
    "comments-textarea-focus-border-color",
    "comments-textarea-focus-foreground-color",
    "comments-textarea-focus-background-color",

    // Comments indicator
    "comments-indicator-size",
    "comments-indicator-color",

    // License
    "license-horizontal-padding",
    "license-vertical-padding",
    "license-foreground-color",
    "license-background-color",

    // Link
    "link-color",
    "link-hover-color",

    // Input
    "input-border-width",
    "input-border-radius",
    "input-horizontal-padding",
    "input-vertical-padding",
    "input-border-color",
    "input-foreground-color",
    "input-background-color",
    // Input hover
    "input-hover-border-color",
    "input-hover-foreground-color",
    "input-hover-background-color",
    // Input disabled
    "input-disabled-border-color",
    "input-disabled-foreground-color",
    "input-disabled-background-color",
    // Input focus
    "input-focus-border-color",
    "input-focus-foreground-color",
    "input-focus-background-color",

    // Menu
    "menu-border-width",
    "menu-border-radius",
    "menu-horizontal-padding",
    "menu-vertical-padding",
    "menu-item-horizontal-padding",
    "menu-item-vertical-padding",
    "menu-border-color",
    "menu-shadow-x",
    "menu-shadow-y",
    "menu-shadow-blur",
    "menu-shadow-color",
    "menu-item-hover-color",
    "menu-item-active-color",
]

exports.tokensKeys = tokensKeys;
