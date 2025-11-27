const tokensKeys = [
    // Typography Variables
    "font-size",
    "font-size-small",
    "line-height",
    "line-height-small",
    "font-weight",
    "letter-spacing",

    // Layout & Spacing Variables
    "gap-size",
    "icon-size",
    "table-transition",

    // Color System Variables
    "border-color",
    "accent-color",
    "foreground-color",
    "foreground-secondary-color",
    "background-color",
    "placeholder-color",
    "read-only-color",
    "disabled-color",

    // Shadow Variables
    "shadow-color",
    "shadow-x",
    "shadow-y",
    "shadow-blur",

    // Bar Variables
    "bar-foreground-color",
    "bar-background-color",
    "bar-horizontal-padding",
    "bar-vertical-padding",

    // Cell Border Variables
    "cell-horizontal-border-color",
    "cell-vertical-border-color",

    // Wrapper Variables
    "wrapper-border-width",
    "wrapper-border-radius",
    "wrapper-border-color",

    // Row Styling Variables
    "row-header-odd-background-color",
    "row-header-even-background-color",
    "row-cell-odd-background-color",
    "row-cell-even-background-color",

    // Cell Padding Variables
    "cell-horizontal-padding",
    "cell-vertical-padding",

    // Cell Editor Variables
    "cell-editor-border-width",
    "cell-editor-border-color",
    "cell-editor-foreground-color",
    "cell-editor-background-color",
    "cell-editor-shadow-blur-radius",
    "cell-editor-shadow-color",

    // Cell State Variables
    "cell-success-background-color",
    "cell-error-background-color",
    "cell-read-only-background-color",

    // Cell Selection Variables
    "cell-selection-border-color",
    "cell-selection-background-color",

    // Cell Autofill Variables
    "cell-autofill-size",
    "cell-autofill-hit-area-size",
    "cell-autofill-border-width",
    "cell-autofill-border-radius",
    "cell-autofill-border-color",
    "cell-autofill-background-color",
    "cell-autofill-fill-border-color",

    // Cell Mobile Handle Variables
    "cell-mobile-handle-size",
    "cell-mobile-handle-border-width",
    "cell-mobile-handle-border-radius",
    "cell-mobile-handle-border-color",
    "cell-mobile-handle-background-color",

    // Indicator Variables
    "resize-indicator-color",
    "move-backlight-color",
    "move-indicator-color",
    "hidden-indicator-color",

    // Scrollbar Variables
    "scrollbar-border-radius",
    "scrollbar-track-color",
    "scrollbar-thumb-color",

    // Header Variables
    "header-font-weight",
    "header-foreground-color",
    "header-background-color",
    "header-highlighted-shadow-size",
    "header-highlighted-foreground-color",
    "header-highlighted-background-color",
    "header-active-border-color",
    "header-active-foreground-color",
    "header-active-background-color",
    "header-filter-background-color",

    // Header Row Variables
    "header-row-foreground-color",
    "header-row-background-color",
    "header-row-highlighted-foreground-color",
    "header-row-highlighted-background-color",
    "header-row-active-foreground-color",
    "header-row-active-background-color",

    // Checkbox Variables
    "checkbox-size",
    "checkbox-border-radius",
    "checkbox-border-color",
    "checkbox-background-color",
    "checkbox-icon-color",
    "checkbox-focus-border-color",
    "checkbox-focus-background-color",
    "checkbox-focus-icon-color",
    "checkbox-focus-ring-color",
    "checkbox-disabled-border-color",
    "checkbox-disabled-background-color",
    "checkbox-disabled-icon-color",
    "checkbox-checked-border-color",
    "checkbox-checked-background-color",
    "checkbox-checked-icon-color",
    "checkbox-checked-focus-border-color",
    "checkbox-checked-focus-background-color",
    "checkbox-checked-focus-icon-color",
    "checkbox-checked-disabled-border-color",
    "checkbox-checked-disabled-background-color",
    "checkbox-checked-disabled-icon-color",
    "checkbox-indeterminate-border-color",
    "checkbox-indeterminate-background-color",
    "checkbox-indeterminate-icon-color",
    "checkbox-indeterminate-focus-border-color",
    "checkbox-indeterminate-focus-background-color",
    "checkbox-indeterminate-focus-icon-color",
    "checkbox-indeterminate-disabled-border-color",
    "checkbox-indeterminate-disabled-background-color",
    "checkbox-indeterminate-disabled-icon-color",

    // Radio Button Variables
    "radio-size",
    "radio-border-color",
    "radio-background-color",
    "radio-icon-color",
    "radio-focus-border-color",
    "radio-focus-background-color",
    "radio-focus-icon-color",
    "radio-focus-ring-color",
    "radio-disabled-border-color",
    "radio-disabled-background-color",
    "radio-disabled-icon-color",
    "radio-checked-border-color",
    "radio-checked-background-color",
    "radio-checked-icon-color",
    "radio-checked-focus-border-color",
    "radio-checked-focus-background-color",
    "radio-checked-focus-icon-color",
    "radio-checked-disabled-border-color",
    "radio-checked-disabled-background-color",
    "radio-checked-disabled-icon-color",

    // Icon Button Variables
    "icon-button-border-radius",
    "icon-button-large-border-radius",
    "icon-button-large-padding",
    "icon-button-border-color",
    "icon-button-background-color",
    "icon-button-icon-color",
    "icon-button-hover-border-color",
    "icon-button-hover-background-color",
    "icon-button-hover-icon-color",
    "icon-button-active-border-color",
    "icon-button-active-background-color",
    "icon-button-active-icon-color",
    "icon-button-active-hover-border-color",
    "icon-button-active-hover-background-color",
    "icon-button-active-hover-icon-color",

    // Collapse Button Variables
    "collapse-button-border-radius",
    "collapse-button-open-border-color",
    "collapse-button-open-background-color",
    "collapse-button-open-icon-color",
    "collapse-button-open-icon-active-color",
    "collapse-button-open-hover-border-color",
    "collapse-button-open-hover-background-color",
    "collapse-button-open-hover-icon-color",
    "collapse-button-open-hover-icon-active-color",
    "collapse-button-close-border-color",
    "collapse-button-close-background-color",
    "collapse-button-close-icon-color",
    "collapse-button-close-icon-active-color",
    "collapse-button-close-hover-border-color",
    "collapse-button-close-hover-background-color",
    "collapse-button-close-hover-icon-color",
    "collapse-button-close-hover-icon-active-color",

    // Button Variables
    "button-border-radius",
    "button-horizontal-padding",
    "button-vertical-padding",

    // Primary Button Variables
    "primary-button-border-color",
    "primary-button-foreground-color",
    "primary-button-background-color",
    "primary-button-disabled-border-color",
    "primary-button-disabled-foreground-color",
    "primary-button-disabled-background-color",
    "primary-button-hover-border-color",
    "primary-button-hover-foreground-color",
    "primary-button-hover-background-color",
    "primary-button-focus-border-color",
    "primary-button-focus-foreground-color",
    "primary-button-focus-background-color",

    // Secondary Button Variables
    "secondary-button-border-color",
    "secondary-button-foreground-color",
    "secondary-button-background-color",
    "secondary-button-disabled-border-color",
    "secondary-button-disabled-foreground-color",
    "secondary-button-disabled-background-color",
    "secondary-button-hover-border-color",
    "secondary-button-hover-foreground-color",
    "secondary-button-hover-background-color",
    "secondary-button-focus-border-color",
    "secondary-button-focus-foreground-color",
    "secondary-button-focus-background-color",

    // Comments Variables
    "comments-textarea-horizontal-padding",
    "comments-textarea-vertical-padding",
    "comments-textarea-border-width",
    "comments-textarea-border-color",
    "comments-textarea-foreground-color",
    "comments-textarea-background-color",
    "comments-textarea-focus-border-width",
    "comments-textarea-focus-border-color",
    "comments-textarea-focus-foreground-color",
    "comments-textarea-focus-background-color",
    "comments-indicator-size",
    "comments-indicator-color",

    // License Variables
    "license-horizontal-padding",
    "license-vertical-padding",
    "license-foreground-color",
    "license-background-color",

    // Link Variables
    "link-color",
    "link-hover-color",

    // Input Variables
    "input-border-width",
    "input-border-radius",
    "input-horizontal-padding",
    "input-vertical-padding",
    "input-border-color",
    "input-foreground-color",
    "input-background-color",
    "input-hover-border-color",
    "input-hover-foreground-color",
    "input-hover-background-color",
    "input-disabled-border-color",
    "input-disabled-foreground-color",
    "input-disabled-background-color",
    "input-focus-border-color",
    "input-focus-foreground-color",
    "input-focus-background-color",

    // Menu Variables
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

    // Dialog Variables
    "dialog-semi-transparent-background-color",
    "dialog-solid-background-color",
    "dialog-content-padding-horizontal",
    "dialog-content-padding-vertical",
    "dialog-content-border-radius",
    "dialog-content-background-color",

    // Pagination Variables
    "pagination-bar-foreground-color",
    "pagination-bar-background-color",
    "pagination-bar-horizontal-padding",
    "pagination-bar-vertical-padding",
]

exports.tokensKeys = tokensKeys;
