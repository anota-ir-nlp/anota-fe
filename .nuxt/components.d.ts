
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T extends DefineComponent> = T & DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>>
type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = (T & DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }>)
interface _GlobalComponents {
      'DashboardColumns': typeof import("../components/dashboard/columns")['default']
    'DocumentsColumns': typeof import("../components/documents/columns")['default']
    'ErrorTypesColumns': typeof import("../components/error-types/columns")['default']
    'ProjectsColumns': typeof import("../components/projects/columns")['default']
    'UsersColumns': typeof import("../components/users/columns")['default']
    'UAccordion': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Accordion.vue")['default']
    'UAlert': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Alert.vue")['default']
    'UApp': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/App.vue")['default']
    'UAvatar': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Avatar.vue")['default']
    'UAvatarGroup': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/AvatarGroup.vue")['default']
    'UBadge': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Badge.vue")['default']
    'UBreadcrumb': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Breadcrumb.vue")['default']
    'UButton': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Button.vue")['default']
    'UButtonGroup': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/ButtonGroup.vue")['default']
    'UCalendar': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Calendar.vue")['default']
    'UCard': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Card.vue")['default']
    'UCarousel': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Carousel.vue")['default']
    'UCheckbox': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Checkbox.vue")['default']
    'UCheckboxGroup': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/CheckboxGroup.vue")['default']
    'UChip': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Chip.vue")['default']
    'UCollapsible': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Collapsible.vue")['default']
    'UColorPicker': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/ColorPicker.vue")['default']
    'UCommandPalette': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/CommandPalette.vue")['default']
    'UContainer': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Container.vue")['default']
    'UContextMenu': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/ContextMenu.vue")['default']
    'UContextMenuContent': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/ContextMenuContent.vue")['default']
    'UDrawer': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Drawer.vue")['default']
    'UDropdownMenu': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/DropdownMenu.vue")['default']
    'UDropdownMenuContent': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/DropdownMenuContent.vue")['default']
    'UForm': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Form.vue")['default']
    'UFormField': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/FormField.vue")['default']
    'UIcon': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Icon.vue")['default']
    'UInput': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Input.vue")['default']
    'UInputMenu': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/InputMenu.vue")['default']
    'UInputNumber': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/InputNumber.vue")['default']
    'UInputTags': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/InputTags.vue")['default']
    'UKbd': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Kbd.vue")['default']
    'ULink': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Link.vue")['default']
    'ULinkBase': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/LinkBase.vue")['default']
    'UModal': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Modal.vue")['default']
    'UNavigationMenu': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/NavigationMenu.vue")['default']
    'UOverlayProvider': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/OverlayProvider.vue")['default']
    'UPagination': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Pagination.vue")['default']
    'UPinInput': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/PinInput.vue")['default']
    'UPopover': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Popover.vue")['default']
    'UProgress': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Progress.vue")['default']
    'URadioGroup': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/RadioGroup.vue")['default']
    'USelect': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Select.vue")['default']
    'USelectMenu': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/SelectMenu.vue")['default']
    'USeparator': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Separator.vue")['default']
    'USkeleton': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Skeleton.vue")['default']
    'USlideover': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Slideover.vue")['default']
    'USlider': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Slider.vue")['default']
    'UStepper': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Stepper.vue")['default']
    'USwitch': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Switch.vue")['default']
    'UTable': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Table.vue")['default']
    'UTabs': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Tabs.vue")['default']
    'UTextarea': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Textarea.vue")['default']
    'UTimeline': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Timeline.vue")['default']
    'UToast': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Toast.vue")['default']
    'UToaster': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Toaster.vue")['default']
    'UTooltip': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Tooltip.vue")['default']
    'UTree': typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Tree.vue")['default']
    'NuxtWelcome': typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/welcome.vue")['default']
    'NuxtLayout': typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/nuxt-layout")['default']
    'NuxtErrorBoundary': typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
    'ClientOnly': typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/client-only")['default']
    'DevOnly': typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/dev-only")['default']
    'ServerPlaceholder': typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/server-placeholder")['default']
    'NuxtLink': typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/nuxt-link")['default']
    'NuxtLoadingIndicator': typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
    'NuxtTime': typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
    'NuxtRouteAnnouncer': typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
    'NuxtImg': typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
    'NuxtPicture': typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
    'ColorScheme': typeof import("../node_modules/@nuxtjs/color-mode/dist/runtime/component.vue3.vue")['default']
    'Icon': typeof import("../node_modules/.pnpm/@nuxt+icon@1.15.0_magicast@_e6f235bad8c3f088f8f3fb06f3deddba/node_modules/@nuxt/icon/dist/runtime/components/index")['default']
    'NuxtLinkLocale': typeof import("../node_modules/.pnpm/@nuxtjs+i18n@9.5.6_@vue+com_f82eebb8c67b0644cfbd72c424dd2ca1/node_modules/@nuxtjs/i18n/dist/runtime/components/NuxtLinkLocale")['default']
    'SwitchLocalePathLink': typeof import("../node_modules/.pnpm/@nuxtjs+i18n@9.5.6_@vue+com_f82eebb8c67b0644cfbd72c424dd2ca1/node_modules/@nuxtjs/i18n/dist/runtime/components/SwitchLocalePathLink")['default']
    'Accordion': typeof import("../components/ui/accordion/index")['Accordion']
    'AccordionContent': typeof import("../components/ui/accordion/index")['AccordionContent']
    'AccordionItem': typeof import("../components/ui/accordion/index")['AccordionItem']
    'AccordionTrigger': typeof import("../components/ui/accordion/index")['AccordionTrigger']
    'Badge': typeof import("../components/ui/badge/index")['Badge']
    'Avatar': typeof import("../components/ui/avatar/index")['Avatar']
    'AvatarFallback': typeof import("../components/ui/avatar/index")['AvatarFallback']
    'AvatarImage': typeof import("../components/ui/avatar/index")['AvatarImage']
    'Button': typeof import("../components/ui/button/index")['Button']
    'Calendar': typeof import("../components/ui/calendar/index")['Calendar']
    'CalendarCell': typeof import("../components/ui/calendar/index")['CalendarCell']
    'CalendarCellTrigger': typeof import("../components/ui/calendar/index")['CalendarCellTrigger']
    'CalendarGrid': typeof import("../components/ui/calendar/index")['CalendarGrid']
    'CalendarGridBody': typeof import("../components/ui/calendar/index")['CalendarGridBody']
    'CalendarGridHead': typeof import("../components/ui/calendar/index")['CalendarGridHead']
    'CalendarGridRow': typeof import("../components/ui/calendar/index")['CalendarGridRow']
    'CalendarHeadCell': typeof import("../components/ui/calendar/index")['CalendarHeadCell']
    'CalendarHeader': typeof import("../components/ui/calendar/index")['CalendarHeader']
    'CalendarHeading': typeof import("../components/ui/calendar/index")['CalendarHeading']
    'CalendarNextButton': typeof import("../components/ui/calendar/index")['CalendarNextButton']
    'CalendarPrevButton': typeof import("../components/ui/calendar/index")['CalendarPrevButton']
    'Card': typeof import("../components/ui/card/index")['Card']
    'CardAction': typeof import("../components/ui/card/index")['CardAction']
    'CardContent': typeof import("../components/ui/card/index")['CardContent']
    'CardDescription': typeof import("../components/ui/card/index")['CardDescription']
    'CardFooter': typeof import("../components/ui/card/index")['CardFooter']
    'CardHeader': typeof import("../components/ui/card/index")['CardHeader']
    'CardTitle': typeof import("../components/ui/card/index")['CardTitle']
    'Checkbox': typeof import("../components/ui/checkbox/index")['Checkbox']
    'DataTable': typeof import("../components/ui/data-table/index")['DataTable']
    'DataTableDropdown': typeof import("../components/ui/data-table/index")['DataTableDropdown']
    'Dialog': typeof import("../components/ui/dialog/index")['Dialog']
    'DialogClose': typeof import("../components/ui/dialog/index")['DialogClose']
    'DialogContent': typeof import("../components/ui/dialog/index")['DialogContent']
    'DialogDescription': typeof import("../components/ui/dialog/index")['DialogDescription']
    'DialogFooter': typeof import("../components/ui/dialog/index")['DialogFooter']
    'DialogHeader': typeof import("../components/ui/dialog/index")['DialogHeader']
    'DialogOverlay': typeof import("../components/ui/dialog/index")['DialogOverlay']
    'DialogScrollContent': typeof import("../components/ui/dialog/index")['DialogScrollContent']
    'DialogTitle': typeof import("../components/ui/dialog/index")['DialogTitle']
    'DialogTrigger': typeof import("../components/ui/dialog/index")['DialogTrigger']
    'DropdownMenu': typeof import("../components/ui/dropdown-menu/index")['DropdownMenu']
    'DropdownMenuCheckboxItem': typeof import("../components/ui/dropdown-menu/index")['DropdownMenuCheckboxItem']
    'DropdownMenuContent': typeof import("../components/ui/dropdown-menu/index")['DropdownMenuContent']
    'DropdownMenuGroup': typeof import("../components/ui/dropdown-menu/index")['DropdownMenuGroup']
    'DropdownMenuItem': typeof import("../components/ui/dropdown-menu/index")['DropdownMenuItem']
    'DropdownMenuLabel': typeof import("../components/ui/dropdown-menu/index")['DropdownMenuLabel']
    'DropdownMenuRadioGroup': typeof import("../components/ui/dropdown-menu/index")['DropdownMenuRadioGroup']
    'DropdownMenuRadioItem': typeof import("../components/ui/dropdown-menu/index")['DropdownMenuRadioItem']
    'DropdownMenuSeparator': typeof import("../components/ui/dropdown-menu/index")['DropdownMenuSeparator']
    'DropdownMenuShortcut': typeof import("../components/ui/dropdown-menu/index")['DropdownMenuShortcut']
    'DropdownMenuSub': typeof import("../components/ui/dropdown-menu/index")['DropdownMenuSub']
    'DropdownMenuSubContent': typeof import("../components/ui/dropdown-menu/index")['DropdownMenuSubContent']
    'DropdownMenuSubTrigger': typeof import("../components/ui/dropdown-menu/index")['DropdownMenuSubTrigger']
    'DropdownMenuTrigger': typeof import("../components/ui/dropdown-menu/index")['DropdownMenuTrigger']
    'DropdownMenuPortal': typeof import("../components/ui/dropdown-menu/index")['DropdownMenuPortal']
    'Combobox': typeof import("../components/ui/combobox/index")['Combobox']
    'ComboboxAnchor': typeof import("../components/ui/combobox/index")['ComboboxAnchor']
    'ComboboxEmpty': typeof import("../components/ui/combobox/index")['ComboboxEmpty']
    'ComboboxGroup': typeof import("../components/ui/combobox/index")['ComboboxGroup']
    'ComboboxInput': typeof import("../components/ui/combobox/index")['ComboboxInput']
    'ComboboxItem': typeof import("../components/ui/combobox/index")['ComboboxItem']
    'ComboboxItemIndicator': typeof import("../components/ui/combobox/index")['ComboboxItemIndicator']
    'ComboboxList': typeof import("../components/ui/combobox/index")['ComboboxList']
    'ComboboxSeparator': typeof import("../components/ui/combobox/index")['ComboboxSeparator']
    'ComboboxViewport': typeof import("../components/ui/combobox/index")['ComboboxViewport']
    'ComboboxCancel': typeof import("../components/ui/combobox/index")['ComboboxCancel']
    'ComboboxTrigger': typeof import("../components/ui/combobox/index")['ComboboxTrigger']
    'Menubar': typeof import("../components/ui/menubar/index")['Menubar']
    'MenubarCheckboxItem': typeof import("../components/ui/menubar/index")['MenubarCheckboxItem']
    'MenubarContent': typeof import("../components/ui/menubar/index")['MenubarContent']
    'MenubarGroup': typeof import("../components/ui/menubar/index")['MenubarGroup']
    'MenubarItem': typeof import("../components/ui/menubar/index")['MenubarItem']
    'MenubarLabel': typeof import("../components/ui/menubar/index")['MenubarLabel']
    'MenubarMenu': typeof import("../components/ui/menubar/index")['MenubarMenu']
    'MenubarRadioGroup': typeof import("../components/ui/menubar/index")['MenubarRadioGroup']
    'MenubarRadioItem': typeof import("../components/ui/menubar/index")['MenubarRadioItem']
    'MenubarSeparator': typeof import("../components/ui/menubar/index")['MenubarSeparator']
    'MenubarShortcut': typeof import("../components/ui/menubar/index")['MenubarShortcut']
    'MenubarSub': typeof import("../components/ui/menubar/index")['MenubarSub']
    'MenubarSubContent': typeof import("../components/ui/menubar/index")['MenubarSubContent']
    'MenubarSubTrigger': typeof import("../components/ui/menubar/index")['MenubarSubTrigger']
    'MenubarTrigger': typeof import("../components/ui/menubar/index")['MenubarTrigger']
    'Pagination': typeof import("../components/ui/pagination/index")['Pagination']
    'PaginationContent': typeof import("../components/ui/pagination/index")['PaginationContent']
    'PaginationEllipsis': typeof import("../components/ui/pagination/index")['PaginationEllipsis']
    'PaginationFirst': typeof import("../components/ui/pagination/index")['PaginationFirst']
    'PaginationItem': typeof import("../components/ui/pagination/index")['PaginationItem']
    'PaginationLast': typeof import("../components/ui/pagination/index")['PaginationLast']
    'PaginationNext': typeof import("../components/ui/pagination/index")['PaginationNext']
    'PaginationPrevious': typeof import("../components/ui/pagination/index")['PaginationPrevious']
    'Input': typeof import("../components/ui/input/index")['Input']
    'Progress': typeof import("../components/ui/progress/index")['Progress']
    'Select': typeof import("../components/ui/select/index")['Select']
    'SelectContent': typeof import("../components/ui/select/index")['SelectContent']
    'SelectGroup': typeof import("../components/ui/select/index")['SelectGroup']
    'SelectItem': typeof import("../components/ui/select/index")['SelectItem']
    'SelectItemText': typeof import("../components/ui/select/index")['SelectItemText']
    'SelectLabel': typeof import("../components/ui/select/index")['SelectLabel']
    'SelectScrollDownButton': typeof import("../components/ui/select/index")['SelectScrollDownButton']
    'SelectScrollUpButton': typeof import("../components/ui/select/index")['SelectScrollUpButton']
    'SelectSeparator': typeof import("../components/ui/select/index")['SelectSeparator']
    'SelectTrigger': typeof import("../components/ui/select/index")['SelectTrigger']
    'SelectValue': typeof import("../components/ui/select/index")['SelectValue']
    'Popover': typeof import("../components/ui/popover/index")['Popover']
    'PopoverContent': typeof import("../components/ui/popover/index")['PopoverContent']
    'PopoverTrigger': typeof import("../components/ui/popover/index")['PopoverTrigger']
    'PopoverAnchor': typeof import("../components/ui/popover/index")['PopoverAnchor']
    'Table': typeof import("../components/ui/table/index")['Table']
    'TableBody': typeof import("../components/ui/table/index")['TableBody']
    'TableCaption': typeof import("../components/ui/table/index")['TableCaption']
    'TableCell': typeof import("../components/ui/table/index")['TableCell']
    'TableEmpty': typeof import("../components/ui/table/index")['TableEmpty']
    'TableFooter': typeof import("../components/ui/table/index")['TableFooter']
    'TableHead': typeof import("../components/ui/table/index")['TableHead']
    'TableHeader': typeof import("../components/ui/table/index")['TableHeader']
    'TableRow': typeof import("../components/ui/table/index")['TableRow']
    'Toaster': typeof import("../components/ui/sonner/index")['Toaster']
    'Textarea': typeof import("../components/ui/textarea/index")['Textarea']
    'TagsInput': typeof import("../components/ui/tags-input/index")['TagsInput']
    'TagsInputInput': typeof import("../components/ui/tags-input/index")['TagsInputInput']
    'TagsInputItem': typeof import("../components/ui/tags-input/index")['TagsInputItem']
    'TagsInputItemDelete': typeof import("../components/ui/tags-input/index")['TagsInputItemDelete']
    'TagsInputItemText': typeof import("../components/ui/tags-input/index")['TagsInputItemText']
    'NuxtPage': typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/pages/runtime/page")['default']
    'NoScript': typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/head/runtime/components")['NoScript']
    'Link': typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/head/runtime/components")['Link']
    'Base': typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/head/runtime/components")['Base']
    'Title': typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/head/runtime/components")['Title']
    'Meta': typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/head/runtime/components")['Meta']
    'Style': typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/head/runtime/components")['Style']
    'Head': typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/head/runtime/components")['Head']
    'Html': typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/head/runtime/components")['Html']
    'Body': typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/head/runtime/components")['Body']
    'NuxtIsland': typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/nuxt-island")['default']
    'NuxtRouteAnnouncer': IslandComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/server-placeholder")['default']>
      'LazyDashboardColumns': LazyComponent<typeof import("../components/dashboard/columns")['default']>
    'LazyDocumentsColumns': LazyComponent<typeof import("../components/documents/columns")['default']>
    'LazyErrorTypesColumns': LazyComponent<typeof import("../components/error-types/columns")['default']>
    'LazyProjectsColumns': LazyComponent<typeof import("../components/projects/columns")['default']>
    'LazyUsersColumns': LazyComponent<typeof import("../components/users/columns")['default']>
    'LazyUAccordion': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Accordion.vue")['default']>
    'LazyUAlert': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Alert.vue")['default']>
    'LazyUApp': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/App.vue")['default']>
    'LazyUAvatar': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Avatar.vue")['default']>
    'LazyUAvatarGroup': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/AvatarGroup.vue")['default']>
    'LazyUBadge': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Badge.vue")['default']>
    'LazyUBreadcrumb': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Breadcrumb.vue")['default']>
    'LazyUButton': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Button.vue")['default']>
    'LazyUButtonGroup': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/ButtonGroup.vue")['default']>
    'LazyUCalendar': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Calendar.vue")['default']>
    'LazyUCard': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Card.vue")['default']>
    'LazyUCarousel': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Carousel.vue")['default']>
    'LazyUCheckbox': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Checkbox.vue")['default']>
    'LazyUCheckboxGroup': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/CheckboxGroup.vue")['default']>
    'LazyUChip': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Chip.vue")['default']>
    'LazyUCollapsible': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Collapsible.vue")['default']>
    'LazyUColorPicker': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/ColorPicker.vue")['default']>
    'LazyUCommandPalette': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/CommandPalette.vue")['default']>
    'LazyUContainer': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Container.vue")['default']>
    'LazyUContextMenu': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/ContextMenu.vue")['default']>
    'LazyUContextMenuContent': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/ContextMenuContent.vue")['default']>
    'LazyUDrawer': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Drawer.vue")['default']>
    'LazyUDropdownMenu': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/DropdownMenu.vue")['default']>
    'LazyUDropdownMenuContent': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/DropdownMenuContent.vue")['default']>
    'LazyUForm': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Form.vue")['default']>
    'LazyUFormField': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/FormField.vue")['default']>
    'LazyUIcon': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Icon.vue")['default']>
    'LazyUInput': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Input.vue")['default']>
    'LazyUInputMenu': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/InputMenu.vue")['default']>
    'LazyUInputNumber': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/InputNumber.vue")['default']>
    'LazyUInputTags': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/InputTags.vue")['default']>
    'LazyUKbd': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Kbd.vue")['default']>
    'LazyULink': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Link.vue")['default']>
    'LazyULinkBase': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/LinkBase.vue")['default']>
    'LazyUModal': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Modal.vue")['default']>
    'LazyUNavigationMenu': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/NavigationMenu.vue")['default']>
    'LazyUOverlayProvider': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/OverlayProvider.vue")['default']>
    'LazyUPagination': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Pagination.vue")['default']>
    'LazyUPinInput': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/PinInput.vue")['default']>
    'LazyUPopover': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Popover.vue")['default']>
    'LazyUProgress': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Progress.vue")['default']>
    'LazyURadioGroup': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/RadioGroup.vue")['default']>
    'LazyUSelect': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Select.vue")['default']>
    'LazyUSelectMenu': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/SelectMenu.vue")['default']>
    'LazyUSeparator': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Separator.vue")['default']>
    'LazyUSkeleton': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Skeleton.vue")['default']>
    'LazyUSlideover': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Slideover.vue")['default']>
    'LazyUSlider': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Slider.vue")['default']>
    'LazyUStepper': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Stepper.vue")['default']>
    'LazyUSwitch': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Switch.vue")['default']>
    'LazyUTable': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Table.vue")['default']>
    'LazyUTabs': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Tabs.vue")['default']>
    'LazyUTextarea': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Textarea.vue")['default']>
    'LazyUTimeline': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Timeline.vue")['default']>
    'LazyUToast': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Toast.vue")['default']>
    'LazyUToaster': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Toaster.vue")['default']>
    'LazyUTooltip': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Tooltip.vue")['default']>
    'LazyUTree': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Tree.vue")['default']>
    'LazyNuxtWelcome': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/welcome.vue")['default']>
    'LazyNuxtLayout': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
    'LazyNuxtErrorBoundary': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
    'LazyClientOnly': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/client-only")['default']>
    'LazyDevOnly': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/dev-only")['default']>
    'LazyServerPlaceholder': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/server-placeholder")['default']>
    'LazyNuxtLink': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/nuxt-link")['default']>
    'LazyNuxtLoadingIndicator': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
    'LazyNuxtTime': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
    'LazyNuxtImg': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
    'LazyNuxtPicture': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
    'LazyColorScheme': LazyComponent<typeof import("../node_modules/@nuxtjs/color-mode/dist/runtime/component.vue3.vue")['default']>
    'LazyIcon': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+icon@1.15.0_magicast@_e6f235bad8c3f088f8f3fb06f3deddba/node_modules/@nuxt/icon/dist/runtime/components/index")['default']>
    'LazyNuxtLinkLocale': LazyComponent<typeof import("../node_modules/.pnpm/@nuxtjs+i18n@9.5.6_@vue+com_f82eebb8c67b0644cfbd72c424dd2ca1/node_modules/@nuxtjs/i18n/dist/runtime/components/NuxtLinkLocale")['default']>
    'LazySwitchLocalePathLink': LazyComponent<typeof import("../node_modules/.pnpm/@nuxtjs+i18n@9.5.6_@vue+com_f82eebb8c67b0644cfbd72c424dd2ca1/node_modules/@nuxtjs/i18n/dist/runtime/components/SwitchLocalePathLink")['default']>
    'LazyAccordion': LazyComponent<typeof import("../components/ui/accordion/index")['Accordion']>
    'LazyAccordionContent': LazyComponent<typeof import("../components/ui/accordion/index")['AccordionContent']>
    'LazyAccordionItem': LazyComponent<typeof import("../components/ui/accordion/index")['AccordionItem']>
    'LazyAccordionTrigger': LazyComponent<typeof import("../components/ui/accordion/index")['AccordionTrigger']>
    'LazyBadge': LazyComponent<typeof import("../components/ui/badge/index")['Badge']>
    'LazyAvatar': LazyComponent<typeof import("../components/ui/avatar/index")['Avatar']>
    'LazyAvatarFallback': LazyComponent<typeof import("../components/ui/avatar/index")['AvatarFallback']>
    'LazyAvatarImage': LazyComponent<typeof import("../components/ui/avatar/index")['AvatarImage']>
    'LazyButton': LazyComponent<typeof import("../components/ui/button/index")['Button']>
    'LazyCalendar': LazyComponent<typeof import("../components/ui/calendar/index")['Calendar']>
    'LazyCalendarCell': LazyComponent<typeof import("../components/ui/calendar/index")['CalendarCell']>
    'LazyCalendarCellTrigger': LazyComponent<typeof import("../components/ui/calendar/index")['CalendarCellTrigger']>
    'LazyCalendarGrid': LazyComponent<typeof import("../components/ui/calendar/index")['CalendarGrid']>
    'LazyCalendarGridBody': LazyComponent<typeof import("../components/ui/calendar/index")['CalendarGridBody']>
    'LazyCalendarGridHead': LazyComponent<typeof import("../components/ui/calendar/index")['CalendarGridHead']>
    'LazyCalendarGridRow': LazyComponent<typeof import("../components/ui/calendar/index")['CalendarGridRow']>
    'LazyCalendarHeadCell': LazyComponent<typeof import("../components/ui/calendar/index")['CalendarHeadCell']>
    'LazyCalendarHeader': LazyComponent<typeof import("../components/ui/calendar/index")['CalendarHeader']>
    'LazyCalendarHeading': LazyComponent<typeof import("../components/ui/calendar/index")['CalendarHeading']>
    'LazyCalendarNextButton': LazyComponent<typeof import("../components/ui/calendar/index")['CalendarNextButton']>
    'LazyCalendarPrevButton': LazyComponent<typeof import("../components/ui/calendar/index")['CalendarPrevButton']>
    'LazyCard': LazyComponent<typeof import("../components/ui/card/index")['Card']>
    'LazyCardAction': LazyComponent<typeof import("../components/ui/card/index")['CardAction']>
    'LazyCardContent': LazyComponent<typeof import("../components/ui/card/index")['CardContent']>
    'LazyCardDescription': LazyComponent<typeof import("../components/ui/card/index")['CardDescription']>
    'LazyCardFooter': LazyComponent<typeof import("../components/ui/card/index")['CardFooter']>
    'LazyCardHeader': LazyComponent<typeof import("../components/ui/card/index")['CardHeader']>
    'LazyCardTitle': LazyComponent<typeof import("../components/ui/card/index")['CardTitle']>
    'LazyCheckbox': LazyComponent<typeof import("../components/ui/checkbox/index")['Checkbox']>
    'LazyDataTable': LazyComponent<typeof import("../components/ui/data-table/index")['DataTable']>
    'LazyDataTableDropdown': LazyComponent<typeof import("../components/ui/data-table/index")['DataTableDropdown']>
    'LazyDialog': LazyComponent<typeof import("../components/ui/dialog/index")['Dialog']>
    'LazyDialogClose': LazyComponent<typeof import("../components/ui/dialog/index")['DialogClose']>
    'LazyDialogContent': LazyComponent<typeof import("../components/ui/dialog/index")['DialogContent']>
    'LazyDialogDescription': LazyComponent<typeof import("../components/ui/dialog/index")['DialogDescription']>
    'LazyDialogFooter': LazyComponent<typeof import("../components/ui/dialog/index")['DialogFooter']>
    'LazyDialogHeader': LazyComponent<typeof import("../components/ui/dialog/index")['DialogHeader']>
    'LazyDialogOverlay': LazyComponent<typeof import("../components/ui/dialog/index")['DialogOverlay']>
    'LazyDialogScrollContent': LazyComponent<typeof import("../components/ui/dialog/index")['DialogScrollContent']>
    'LazyDialogTitle': LazyComponent<typeof import("../components/ui/dialog/index")['DialogTitle']>
    'LazyDialogTrigger': LazyComponent<typeof import("../components/ui/dialog/index")['DialogTrigger']>
    'LazyDropdownMenu': LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenu']>
    'LazyDropdownMenuCheckboxItem': LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuCheckboxItem']>
    'LazyDropdownMenuContent': LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuContent']>
    'LazyDropdownMenuGroup': LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuGroup']>
    'LazyDropdownMenuItem': LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuItem']>
    'LazyDropdownMenuLabel': LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuLabel']>
    'LazyDropdownMenuRadioGroup': LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuRadioGroup']>
    'LazyDropdownMenuRadioItem': LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuRadioItem']>
    'LazyDropdownMenuSeparator': LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuSeparator']>
    'LazyDropdownMenuShortcut': LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuShortcut']>
    'LazyDropdownMenuSub': LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuSub']>
    'LazyDropdownMenuSubContent': LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuSubContent']>
    'LazyDropdownMenuSubTrigger': LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuSubTrigger']>
    'LazyDropdownMenuTrigger': LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuTrigger']>
    'LazyDropdownMenuPortal': LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuPortal']>
    'LazyCombobox': LazyComponent<typeof import("../components/ui/combobox/index")['Combobox']>
    'LazyComboboxAnchor': LazyComponent<typeof import("../components/ui/combobox/index")['ComboboxAnchor']>
    'LazyComboboxEmpty': LazyComponent<typeof import("../components/ui/combobox/index")['ComboboxEmpty']>
    'LazyComboboxGroup': LazyComponent<typeof import("../components/ui/combobox/index")['ComboboxGroup']>
    'LazyComboboxInput': LazyComponent<typeof import("../components/ui/combobox/index")['ComboboxInput']>
    'LazyComboboxItem': LazyComponent<typeof import("../components/ui/combobox/index")['ComboboxItem']>
    'LazyComboboxItemIndicator': LazyComponent<typeof import("../components/ui/combobox/index")['ComboboxItemIndicator']>
    'LazyComboboxList': LazyComponent<typeof import("../components/ui/combobox/index")['ComboboxList']>
    'LazyComboboxSeparator': LazyComponent<typeof import("../components/ui/combobox/index")['ComboboxSeparator']>
    'LazyComboboxViewport': LazyComponent<typeof import("../components/ui/combobox/index")['ComboboxViewport']>
    'LazyComboboxCancel': LazyComponent<typeof import("../components/ui/combobox/index")['ComboboxCancel']>
    'LazyComboboxTrigger': LazyComponent<typeof import("../components/ui/combobox/index")['ComboboxTrigger']>
    'LazyMenubar': LazyComponent<typeof import("../components/ui/menubar/index")['Menubar']>
    'LazyMenubarCheckboxItem': LazyComponent<typeof import("../components/ui/menubar/index")['MenubarCheckboxItem']>
    'LazyMenubarContent': LazyComponent<typeof import("../components/ui/menubar/index")['MenubarContent']>
    'LazyMenubarGroup': LazyComponent<typeof import("../components/ui/menubar/index")['MenubarGroup']>
    'LazyMenubarItem': LazyComponent<typeof import("../components/ui/menubar/index")['MenubarItem']>
    'LazyMenubarLabel': LazyComponent<typeof import("../components/ui/menubar/index")['MenubarLabel']>
    'LazyMenubarMenu': LazyComponent<typeof import("../components/ui/menubar/index")['MenubarMenu']>
    'LazyMenubarRadioGroup': LazyComponent<typeof import("../components/ui/menubar/index")['MenubarRadioGroup']>
    'LazyMenubarRadioItem': LazyComponent<typeof import("../components/ui/menubar/index")['MenubarRadioItem']>
    'LazyMenubarSeparator': LazyComponent<typeof import("../components/ui/menubar/index")['MenubarSeparator']>
    'LazyMenubarShortcut': LazyComponent<typeof import("../components/ui/menubar/index")['MenubarShortcut']>
    'LazyMenubarSub': LazyComponent<typeof import("../components/ui/menubar/index")['MenubarSub']>
    'LazyMenubarSubContent': LazyComponent<typeof import("../components/ui/menubar/index")['MenubarSubContent']>
    'LazyMenubarSubTrigger': LazyComponent<typeof import("../components/ui/menubar/index")['MenubarSubTrigger']>
    'LazyMenubarTrigger': LazyComponent<typeof import("../components/ui/menubar/index")['MenubarTrigger']>
    'LazyPagination': LazyComponent<typeof import("../components/ui/pagination/index")['Pagination']>
    'LazyPaginationContent': LazyComponent<typeof import("../components/ui/pagination/index")['PaginationContent']>
    'LazyPaginationEllipsis': LazyComponent<typeof import("../components/ui/pagination/index")['PaginationEllipsis']>
    'LazyPaginationFirst': LazyComponent<typeof import("../components/ui/pagination/index")['PaginationFirst']>
    'LazyPaginationItem': LazyComponent<typeof import("../components/ui/pagination/index")['PaginationItem']>
    'LazyPaginationLast': LazyComponent<typeof import("../components/ui/pagination/index")['PaginationLast']>
    'LazyPaginationNext': LazyComponent<typeof import("../components/ui/pagination/index")['PaginationNext']>
    'LazyPaginationPrevious': LazyComponent<typeof import("../components/ui/pagination/index")['PaginationPrevious']>
    'LazyInput': LazyComponent<typeof import("../components/ui/input/index")['Input']>
    'LazyProgress': LazyComponent<typeof import("../components/ui/progress/index")['Progress']>
    'LazySelect': LazyComponent<typeof import("../components/ui/select/index")['Select']>
    'LazySelectContent': LazyComponent<typeof import("../components/ui/select/index")['SelectContent']>
    'LazySelectGroup': LazyComponent<typeof import("../components/ui/select/index")['SelectGroup']>
    'LazySelectItem': LazyComponent<typeof import("../components/ui/select/index")['SelectItem']>
    'LazySelectItemText': LazyComponent<typeof import("../components/ui/select/index")['SelectItemText']>
    'LazySelectLabel': LazyComponent<typeof import("../components/ui/select/index")['SelectLabel']>
    'LazySelectScrollDownButton': LazyComponent<typeof import("../components/ui/select/index")['SelectScrollDownButton']>
    'LazySelectScrollUpButton': LazyComponent<typeof import("../components/ui/select/index")['SelectScrollUpButton']>
    'LazySelectSeparator': LazyComponent<typeof import("../components/ui/select/index")['SelectSeparator']>
    'LazySelectTrigger': LazyComponent<typeof import("../components/ui/select/index")['SelectTrigger']>
    'LazySelectValue': LazyComponent<typeof import("../components/ui/select/index")['SelectValue']>
    'LazyPopover': LazyComponent<typeof import("../components/ui/popover/index")['Popover']>
    'LazyPopoverContent': LazyComponent<typeof import("../components/ui/popover/index")['PopoverContent']>
    'LazyPopoverTrigger': LazyComponent<typeof import("../components/ui/popover/index")['PopoverTrigger']>
    'LazyPopoverAnchor': LazyComponent<typeof import("../components/ui/popover/index")['PopoverAnchor']>
    'LazyTable': LazyComponent<typeof import("../components/ui/table/index")['Table']>
    'LazyTableBody': LazyComponent<typeof import("../components/ui/table/index")['TableBody']>
    'LazyTableCaption': LazyComponent<typeof import("../components/ui/table/index")['TableCaption']>
    'LazyTableCell': LazyComponent<typeof import("../components/ui/table/index")['TableCell']>
    'LazyTableEmpty': LazyComponent<typeof import("../components/ui/table/index")['TableEmpty']>
    'LazyTableFooter': LazyComponent<typeof import("../components/ui/table/index")['TableFooter']>
    'LazyTableHead': LazyComponent<typeof import("../components/ui/table/index")['TableHead']>
    'LazyTableHeader': LazyComponent<typeof import("../components/ui/table/index")['TableHeader']>
    'LazyTableRow': LazyComponent<typeof import("../components/ui/table/index")['TableRow']>
    'LazyToaster': LazyComponent<typeof import("../components/ui/sonner/index")['Toaster']>
    'LazyTextarea': LazyComponent<typeof import("../components/ui/textarea/index")['Textarea']>
    'LazyTagsInput': LazyComponent<typeof import("../components/ui/tags-input/index")['TagsInput']>
    'LazyTagsInputInput': LazyComponent<typeof import("../components/ui/tags-input/index")['TagsInputInput']>
    'LazyTagsInputItem': LazyComponent<typeof import("../components/ui/tags-input/index")['TagsInputItem']>
    'LazyTagsInputItemDelete': LazyComponent<typeof import("../components/ui/tags-input/index")['TagsInputItemDelete']>
    'LazyTagsInputItemText': LazyComponent<typeof import("../components/ui/tags-input/index")['TagsInputItemText']>
    'LazyNuxtPage': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/pages/runtime/page")['default']>
    'LazyNoScript': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/head/runtime/components")['NoScript']>
    'LazyLink': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/head/runtime/components")['Link']>
    'LazyBase': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/head/runtime/components")['Base']>
    'LazyTitle': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/head/runtime/components")['Title']>
    'LazyMeta': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/head/runtime/components")['Meta']>
    'LazyStyle': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/head/runtime/components")['Style']>
    'LazyHead': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/head/runtime/components")['Head']>
    'LazyHtml': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/head/runtime/components")['Html']>
    'LazyBody': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/head/runtime/components")['Body']>
    'LazyNuxtIsland': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/nuxt-island")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<IslandComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/server-placeholder")['default']>>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export const DashboardColumns: typeof import("../components/dashboard/columns")['default']
export const DocumentsColumns: typeof import("../components/documents/columns")['default']
export const ErrorTypesColumns: typeof import("../components/error-types/columns")['default']
export const ProjectsColumns: typeof import("../components/projects/columns")['default']
export const UsersColumns: typeof import("../components/users/columns")['default']
export const UAccordion: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Accordion.vue")['default']
export const UAlert: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Alert.vue")['default']
export const UApp: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/App.vue")['default']
export const UAvatar: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Avatar.vue")['default']
export const UAvatarGroup: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/AvatarGroup.vue")['default']
export const UBadge: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Badge.vue")['default']
export const UBreadcrumb: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Breadcrumb.vue")['default']
export const UButton: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Button.vue")['default']
export const UButtonGroup: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/ButtonGroup.vue")['default']
export const UCalendar: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Calendar.vue")['default']
export const UCard: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Card.vue")['default']
export const UCarousel: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Carousel.vue")['default']
export const UCheckbox: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Checkbox.vue")['default']
export const UCheckboxGroup: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/CheckboxGroup.vue")['default']
export const UChip: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Chip.vue")['default']
export const UCollapsible: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Collapsible.vue")['default']
export const UColorPicker: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/ColorPicker.vue")['default']
export const UCommandPalette: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/CommandPalette.vue")['default']
export const UContainer: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Container.vue")['default']
export const UContextMenu: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/ContextMenu.vue")['default']
export const UContextMenuContent: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/ContextMenuContent.vue")['default']
export const UDrawer: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Drawer.vue")['default']
export const UDropdownMenu: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/DropdownMenu.vue")['default']
export const UDropdownMenuContent: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/DropdownMenuContent.vue")['default']
export const UForm: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Form.vue")['default']
export const UFormField: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/FormField.vue")['default']
export const UIcon: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Icon.vue")['default']
export const UInput: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Input.vue")['default']
export const UInputMenu: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/InputMenu.vue")['default']
export const UInputNumber: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/InputNumber.vue")['default']
export const UInputTags: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/InputTags.vue")['default']
export const UKbd: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Kbd.vue")['default']
export const ULink: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Link.vue")['default']
export const ULinkBase: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/LinkBase.vue")['default']
export const UModal: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Modal.vue")['default']
export const UNavigationMenu: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/NavigationMenu.vue")['default']
export const UOverlayProvider: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/OverlayProvider.vue")['default']
export const UPagination: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Pagination.vue")['default']
export const UPinInput: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/PinInput.vue")['default']
export const UPopover: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Popover.vue")['default']
export const UProgress: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Progress.vue")['default']
export const URadioGroup: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/RadioGroup.vue")['default']
export const USelect: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Select.vue")['default']
export const USelectMenu: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/SelectMenu.vue")['default']
export const USeparator: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Separator.vue")['default']
export const USkeleton: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Skeleton.vue")['default']
export const USlideover: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Slideover.vue")['default']
export const USlider: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Slider.vue")['default']
export const UStepper: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Stepper.vue")['default']
export const USwitch: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Switch.vue")['default']
export const UTable: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Table.vue")['default']
export const UTabs: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Tabs.vue")['default']
export const UTextarea: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Textarea.vue")['default']
export const UTimeline: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Timeline.vue")['default']
export const UToast: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Toast.vue")['default']
export const UToaster: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Toaster.vue")['default']
export const UTooltip: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Tooltip.vue")['default']
export const UTree: typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Tree.vue")['default']
export const NuxtWelcome: typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/welcome.vue")['default']
export const NuxtLayout: typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/nuxt-layout")['default']
export const NuxtErrorBoundary: typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
export const ClientOnly: typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/client-only")['default']
export const DevOnly: typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/dev-only")['default']
export const ServerPlaceholder: typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const NuxtLink: typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/nuxt-link")['default']
export const NuxtLoadingIndicator: typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
export const NuxtTime: typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
export const NuxtImg: typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
export const NuxtPicture: typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
export const ColorScheme: typeof import("../node_modules/@nuxtjs/color-mode/dist/runtime/component.vue3.vue")['default']
export const Icon: typeof import("../node_modules/.pnpm/@nuxt+icon@1.15.0_magicast@_e6f235bad8c3f088f8f3fb06f3deddba/node_modules/@nuxt/icon/dist/runtime/components/index")['default']
export const NuxtLinkLocale: typeof import("../node_modules/.pnpm/@nuxtjs+i18n@9.5.6_@vue+com_f82eebb8c67b0644cfbd72c424dd2ca1/node_modules/@nuxtjs/i18n/dist/runtime/components/NuxtLinkLocale")['default']
export const SwitchLocalePathLink: typeof import("../node_modules/.pnpm/@nuxtjs+i18n@9.5.6_@vue+com_f82eebb8c67b0644cfbd72c424dd2ca1/node_modules/@nuxtjs/i18n/dist/runtime/components/SwitchLocalePathLink")['default']
export const Accordion: typeof import("../components/ui/accordion/index")['Accordion']
export const AccordionContent: typeof import("../components/ui/accordion/index")['AccordionContent']
export const AccordionItem: typeof import("../components/ui/accordion/index")['AccordionItem']
export const AccordionTrigger: typeof import("../components/ui/accordion/index")['AccordionTrigger']
export const Badge: typeof import("../components/ui/badge/index")['Badge']
export const Avatar: typeof import("../components/ui/avatar/index")['Avatar']
export const AvatarFallback: typeof import("../components/ui/avatar/index")['AvatarFallback']
export const AvatarImage: typeof import("../components/ui/avatar/index")['AvatarImage']
export const Button: typeof import("../components/ui/button/index")['Button']
export const Calendar: typeof import("../components/ui/calendar/index")['Calendar']
export const CalendarCell: typeof import("../components/ui/calendar/index")['CalendarCell']
export const CalendarCellTrigger: typeof import("../components/ui/calendar/index")['CalendarCellTrigger']
export const CalendarGrid: typeof import("../components/ui/calendar/index")['CalendarGrid']
export const CalendarGridBody: typeof import("../components/ui/calendar/index")['CalendarGridBody']
export const CalendarGridHead: typeof import("../components/ui/calendar/index")['CalendarGridHead']
export const CalendarGridRow: typeof import("../components/ui/calendar/index")['CalendarGridRow']
export const CalendarHeadCell: typeof import("../components/ui/calendar/index")['CalendarHeadCell']
export const CalendarHeader: typeof import("../components/ui/calendar/index")['CalendarHeader']
export const CalendarHeading: typeof import("../components/ui/calendar/index")['CalendarHeading']
export const CalendarNextButton: typeof import("../components/ui/calendar/index")['CalendarNextButton']
export const CalendarPrevButton: typeof import("../components/ui/calendar/index")['CalendarPrevButton']
export const Card: typeof import("../components/ui/card/index")['Card']
export const CardAction: typeof import("../components/ui/card/index")['CardAction']
export const CardContent: typeof import("../components/ui/card/index")['CardContent']
export const CardDescription: typeof import("../components/ui/card/index")['CardDescription']
export const CardFooter: typeof import("../components/ui/card/index")['CardFooter']
export const CardHeader: typeof import("../components/ui/card/index")['CardHeader']
export const CardTitle: typeof import("../components/ui/card/index")['CardTitle']
export const Checkbox: typeof import("../components/ui/checkbox/index")['Checkbox']
export const DataTable: typeof import("../components/ui/data-table/index")['DataTable']
export const DataTableDropdown: typeof import("../components/ui/data-table/index")['DataTableDropdown']
export const Dialog: typeof import("../components/ui/dialog/index")['Dialog']
export const DialogClose: typeof import("../components/ui/dialog/index")['DialogClose']
export const DialogContent: typeof import("../components/ui/dialog/index")['DialogContent']
export const DialogDescription: typeof import("../components/ui/dialog/index")['DialogDescription']
export const DialogFooter: typeof import("../components/ui/dialog/index")['DialogFooter']
export const DialogHeader: typeof import("../components/ui/dialog/index")['DialogHeader']
export const DialogOverlay: typeof import("../components/ui/dialog/index")['DialogOverlay']
export const DialogScrollContent: typeof import("../components/ui/dialog/index")['DialogScrollContent']
export const DialogTitle: typeof import("../components/ui/dialog/index")['DialogTitle']
export const DialogTrigger: typeof import("../components/ui/dialog/index")['DialogTrigger']
export const DropdownMenu: typeof import("../components/ui/dropdown-menu/index")['DropdownMenu']
export const DropdownMenuCheckboxItem: typeof import("../components/ui/dropdown-menu/index")['DropdownMenuCheckboxItem']
export const DropdownMenuContent: typeof import("../components/ui/dropdown-menu/index")['DropdownMenuContent']
export const DropdownMenuGroup: typeof import("../components/ui/dropdown-menu/index")['DropdownMenuGroup']
export const DropdownMenuItem: typeof import("../components/ui/dropdown-menu/index")['DropdownMenuItem']
export const DropdownMenuLabel: typeof import("../components/ui/dropdown-menu/index")['DropdownMenuLabel']
export const DropdownMenuRadioGroup: typeof import("../components/ui/dropdown-menu/index")['DropdownMenuRadioGroup']
export const DropdownMenuRadioItem: typeof import("../components/ui/dropdown-menu/index")['DropdownMenuRadioItem']
export const DropdownMenuSeparator: typeof import("../components/ui/dropdown-menu/index")['DropdownMenuSeparator']
export const DropdownMenuShortcut: typeof import("../components/ui/dropdown-menu/index")['DropdownMenuShortcut']
export const DropdownMenuSub: typeof import("../components/ui/dropdown-menu/index")['DropdownMenuSub']
export const DropdownMenuSubContent: typeof import("../components/ui/dropdown-menu/index")['DropdownMenuSubContent']
export const DropdownMenuSubTrigger: typeof import("../components/ui/dropdown-menu/index")['DropdownMenuSubTrigger']
export const DropdownMenuTrigger: typeof import("../components/ui/dropdown-menu/index")['DropdownMenuTrigger']
export const DropdownMenuPortal: typeof import("../components/ui/dropdown-menu/index")['DropdownMenuPortal']
export const Combobox: typeof import("../components/ui/combobox/index")['Combobox']
export const ComboboxAnchor: typeof import("../components/ui/combobox/index")['ComboboxAnchor']
export const ComboboxEmpty: typeof import("../components/ui/combobox/index")['ComboboxEmpty']
export const ComboboxGroup: typeof import("../components/ui/combobox/index")['ComboboxGroup']
export const ComboboxInput: typeof import("../components/ui/combobox/index")['ComboboxInput']
export const ComboboxItem: typeof import("../components/ui/combobox/index")['ComboboxItem']
export const ComboboxItemIndicator: typeof import("../components/ui/combobox/index")['ComboboxItemIndicator']
export const ComboboxList: typeof import("../components/ui/combobox/index")['ComboboxList']
export const ComboboxSeparator: typeof import("../components/ui/combobox/index")['ComboboxSeparator']
export const ComboboxViewport: typeof import("../components/ui/combobox/index")['ComboboxViewport']
export const ComboboxCancel: typeof import("../components/ui/combobox/index")['ComboboxCancel']
export const ComboboxTrigger: typeof import("../components/ui/combobox/index")['ComboboxTrigger']
export const Menubar: typeof import("../components/ui/menubar/index")['Menubar']
export const MenubarCheckboxItem: typeof import("../components/ui/menubar/index")['MenubarCheckboxItem']
export const MenubarContent: typeof import("../components/ui/menubar/index")['MenubarContent']
export const MenubarGroup: typeof import("../components/ui/menubar/index")['MenubarGroup']
export const MenubarItem: typeof import("../components/ui/menubar/index")['MenubarItem']
export const MenubarLabel: typeof import("../components/ui/menubar/index")['MenubarLabel']
export const MenubarMenu: typeof import("../components/ui/menubar/index")['MenubarMenu']
export const MenubarRadioGroup: typeof import("../components/ui/menubar/index")['MenubarRadioGroup']
export const MenubarRadioItem: typeof import("../components/ui/menubar/index")['MenubarRadioItem']
export const MenubarSeparator: typeof import("../components/ui/menubar/index")['MenubarSeparator']
export const MenubarShortcut: typeof import("../components/ui/menubar/index")['MenubarShortcut']
export const MenubarSub: typeof import("../components/ui/menubar/index")['MenubarSub']
export const MenubarSubContent: typeof import("../components/ui/menubar/index")['MenubarSubContent']
export const MenubarSubTrigger: typeof import("../components/ui/menubar/index")['MenubarSubTrigger']
export const MenubarTrigger: typeof import("../components/ui/menubar/index")['MenubarTrigger']
export const Pagination: typeof import("../components/ui/pagination/index")['Pagination']
export const PaginationContent: typeof import("../components/ui/pagination/index")['PaginationContent']
export const PaginationEllipsis: typeof import("../components/ui/pagination/index")['PaginationEllipsis']
export const PaginationFirst: typeof import("../components/ui/pagination/index")['PaginationFirst']
export const PaginationItem: typeof import("../components/ui/pagination/index")['PaginationItem']
export const PaginationLast: typeof import("../components/ui/pagination/index")['PaginationLast']
export const PaginationNext: typeof import("../components/ui/pagination/index")['PaginationNext']
export const PaginationPrevious: typeof import("../components/ui/pagination/index")['PaginationPrevious']
export const Input: typeof import("../components/ui/input/index")['Input']
export const Progress: typeof import("../components/ui/progress/index")['Progress']
export const Select: typeof import("../components/ui/select/index")['Select']
export const SelectContent: typeof import("../components/ui/select/index")['SelectContent']
export const SelectGroup: typeof import("../components/ui/select/index")['SelectGroup']
export const SelectItem: typeof import("../components/ui/select/index")['SelectItem']
export const SelectItemText: typeof import("../components/ui/select/index")['SelectItemText']
export const SelectLabel: typeof import("../components/ui/select/index")['SelectLabel']
export const SelectScrollDownButton: typeof import("../components/ui/select/index")['SelectScrollDownButton']
export const SelectScrollUpButton: typeof import("../components/ui/select/index")['SelectScrollUpButton']
export const SelectSeparator: typeof import("../components/ui/select/index")['SelectSeparator']
export const SelectTrigger: typeof import("../components/ui/select/index")['SelectTrigger']
export const SelectValue: typeof import("../components/ui/select/index")['SelectValue']
export const Popover: typeof import("../components/ui/popover/index")['Popover']
export const PopoverContent: typeof import("../components/ui/popover/index")['PopoverContent']
export const PopoverTrigger: typeof import("../components/ui/popover/index")['PopoverTrigger']
export const PopoverAnchor: typeof import("../components/ui/popover/index")['PopoverAnchor']
export const Table: typeof import("../components/ui/table/index")['Table']
export const TableBody: typeof import("../components/ui/table/index")['TableBody']
export const TableCaption: typeof import("../components/ui/table/index")['TableCaption']
export const TableCell: typeof import("../components/ui/table/index")['TableCell']
export const TableEmpty: typeof import("../components/ui/table/index")['TableEmpty']
export const TableFooter: typeof import("../components/ui/table/index")['TableFooter']
export const TableHead: typeof import("../components/ui/table/index")['TableHead']
export const TableHeader: typeof import("../components/ui/table/index")['TableHeader']
export const TableRow: typeof import("../components/ui/table/index")['TableRow']
export const Toaster: typeof import("../components/ui/sonner/index")['Toaster']
export const Textarea: typeof import("../components/ui/textarea/index")['Textarea']
export const TagsInput: typeof import("../components/ui/tags-input/index")['TagsInput']
export const TagsInputInput: typeof import("../components/ui/tags-input/index")['TagsInputInput']
export const TagsInputItem: typeof import("../components/ui/tags-input/index")['TagsInputItem']
export const TagsInputItemDelete: typeof import("../components/ui/tags-input/index")['TagsInputItemDelete']
export const TagsInputItemText: typeof import("../components/ui/tags-input/index")['TagsInputItemText']
export const NuxtPage: typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/pages/runtime/page")['default']
export const NoScript: typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/head/runtime/components")['NoScript']
export const Link: typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/head/runtime/components")['Link']
export const Base: typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/head/runtime/components")['Base']
export const Title: typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/head/runtime/components")['Title']
export const Meta: typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/head/runtime/components")['Meta']
export const Style: typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/head/runtime/components")['Style']
export const Head: typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/head/runtime/components")['Head']
export const Html: typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/head/runtime/components")['Html']
export const Body: typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/head/runtime/components")['Body']
export const NuxtIsland: typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/nuxt-island")['default']
export const NuxtRouteAnnouncer: IslandComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyDashboardColumns: LazyComponent<typeof import("../components/dashboard/columns")['default']>
export const LazyDocumentsColumns: LazyComponent<typeof import("../components/documents/columns")['default']>
export const LazyErrorTypesColumns: LazyComponent<typeof import("../components/error-types/columns")['default']>
export const LazyProjectsColumns: LazyComponent<typeof import("../components/projects/columns")['default']>
export const LazyUsersColumns: LazyComponent<typeof import("../components/users/columns")['default']>
export const LazyUAccordion: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Accordion.vue")['default']>
export const LazyUAlert: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Alert.vue")['default']>
export const LazyUApp: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/App.vue")['default']>
export const LazyUAvatar: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Avatar.vue")['default']>
export const LazyUAvatarGroup: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/AvatarGroup.vue")['default']>
export const LazyUBadge: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Badge.vue")['default']>
export const LazyUBreadcrumb: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Breadcrumb.vue")['default']>
export const LazyUButton: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Button.vue")['default']>
export const LazyUButtonGroup: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/ButtonGroup.vue")['default']>
export const LazyUCalendar: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Calendar.vue")['default']>
export const LazyUCard: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Card.vue")['default']>
export const LazyUCarousel: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Carousel.vue")['default']>
export const LazyUCheckbox: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Checkbox.vue")['default']>
export const LazyUCheckboxGroup: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/CheckboxGroup.vue")['default']>
export const LazyUChip: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Chip.vue")['default']>
export const LazyUCollapsible: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Collapsible.vue")['default']>
export const LazyUColorPicker: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/ColorPicker.vue")['default']>
export const LazyUCommandPalette: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/CommandPalette.vue")['default']>
export const LazyUContainer: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Container.vue")['default']>
export const LazyUContextMenu: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/ContextMenu.vue")['default']>
export const LazyUContextMenuContent: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/ContextMenuContent.vue")['default']>
export const LazyUDrawer: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Drawer.vue")['default']>
export const LazyUDropdownMenu: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/DropdownMenu.vue")['default']>
export const LazyUDropdownMenuContent: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/DropdownMenuContent.vue")['default']>
export const LazyUForm: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Form.vue")['default']>
export const LazyUFormField: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/FormField.vue")['default']>
export const LazyUIcon: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Icon.vue")['default']>
export const LazyUInput: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Input.vue")['default']>
export const LazyUInputMenu: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/InputMenu.vue")['default']>
export const LazyUInputNumber: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/InputNumber.vue")['default']>
export const LazyUInputTags: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/InputTags.vue")['default']>
export const LazyUKbd: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Kbd.vue")['default']>
export const LazyULink: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Link.vue")['default']>
export const LazyULinkBase: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/LinkBase.vue")['default']>
export const LazyUModal: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Modal.vue")['default']>
export const LazyUNavigationMenu: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/NavigationMenu.vue")['default']>
export const LazyUOverlayProvider: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/OverlayProvider.vue")['default']>
export const LazyUPagination: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Pagination.vue")['default']>
export const LazyUPinInput: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/PinInput.vue")['default']>
export const LazyUPopover: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Popover.vue")['default']>
export const LazyUProgress: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Progress.vue")['default']>
export const LazyURadioGroup: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/RadioGroup.vue")['default']>
export const LazyUSelect: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Select.vue")['default']>
export const LazyUSelectMenu: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/SelectMenu.vue")['default']>
export const LazyUSeparator: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Separator.vue")['default']>
export const LazyUSkeleton: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Skeleton.vue")['default']>
export const LazyUSlideover: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Slideover.vue")['default']>
export const LazyUSlider: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Slider.vue")['default']>
export const LazyUStepper: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Stepper.vue")['default']>
export const LazyUSwitch: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Switch.vue")['default']>
export const LazyUTable: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Table.vue")['default']>
export const LazyUTabs: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Tabs.vue")['default']>
export const LazyUTextarea: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Textarea.vue")['default']>
export const LazyUTimeline: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Timeline.vue")['default']>
export const LazyUToast: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Toast.vue")['default']>
export const LazyUToaster: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Toaster.vue")['default']>
export const LazyUTooltip: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Tooltip.vue")['default']>
export const LazyUTree: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+ui@3.2.0_@babel+parse_f41b31c5293b0a5202e7c0f409aca642/node_modules/@nuxt/ui/dist/runtime/components/Tree.vue")['default']>
export const LazyNuxtWelcome: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/welcome.vue")['default']>
export const LazyNuxtLayout: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
export const LazyNuxtErrorBoundary: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
export const LazyClientOnly: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/client-only")['default']>
export const LazyDevOnly: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/dev-only")['default']>
export const LazyServerPlaceholder: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyNuxtLink: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/nuxt-link")['default']>
export const LazyNuxtLoadingIndicator: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
export const LazyNuxtTime: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
export const LazyNuxtImg: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
export const LazyNuxtPicture: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
export const LazyColorScheme: LazyComponent<typeof import("../node_modules/@nuxtjs/color-mode/dist/runtime/component.vue3.vue")['default']>
export const LazyIcon: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+icon@1.15.0_magicast@_e6f235bad8c3f088f8f3fb06f3deddba/node_modules/@nuxt/icon/dist/runtime/components/index")['default']>
export const LazyNuxtLinkLocale: LazyComponent<typeof import("../node_modules/.pnpm/@nuxtjs+i18n@9.5.6_@vue+com_f82eebb8c67b0644cfbd72c424dd2ca1/node_modules/@nuxtjs/i18n/dist/runtime/components/NuxtLinkLocale")['default']>
export const LazySwitchLocalePathLink: LazyComponent<typeof import("../node_modules/.pnpm/@nuxtjs+i18n@9.5.6_@vue+com_f82eebb8c67b0644cfbd72c424dd2ca1/node_modules/@nuxtjs/i18n/dist/runtime/components/SwitchLocalePathLink")['default']>
export const LazyAccordion: LazyComponent<typeof import("../components/ui/accordion/index")['Accordion']>
export const LazyAccordionContent: LazyComponent<typeof import("../components/ui/accordion/index")['AccordionContent']>
export const LazyAccordionItem: LazyComponent<typeof import("../components/ui/accordion/index")['AccordionItem']>
export const LazyAccordionTrigger: LazyComponent<typeof import("../components/ui/accordion/index")['AccordionTrigger']>
export const LazyBadge: LazyComponent<typeof import("../components/ui/badge/index")['Badge']>
export const LazyAvatar: LazyComponent<typeof import("../components/ui/avatar/index")['Avatar']>
export const LazyAvatarFallback: LazyComponent<typeof import("../components/ui/avatar/index")['AvatarFallback']>
export const LazyAvatarImage: LazyComponent<typeof import("../components/ui/avatar/index")['AvatarImage']>
export const LazyButton: LazyComponent<typeof import("../components/ui/button/index")['Button']>
export const LazyCalendar: LazyComponent<typeof import("../components/ui/calendar/index")['Calendar']>
export const LazyCalendarCell: LazyComponent<typeof import("../components/ui/calendar/index")['CalendarCell']>
export const LazyCalendarCellTrigger: LazyComponent<typeof import("../components/ui/calendar/index")['CalendarCellTrigger']>
export const LazyCalendarGrid: LazyComponent<typeof import("../components/ui/calendar/index")['CalendarGrid']>
export const LazyCalendarGridBody: LazyComponent<typeof import("../components/ui/calendar/index")['CalendarGridBody']>
export const LazyCalendarGridHead: LazyComponent<typeof import("../components/ui/calendar/index")['CalendarGridHead']>
export const LazyCalendarGridRow: LazyComponent<typeof import("../components/ui/calendar/index")['CalendarGridRow']>
export const LazyCalendarHeadCell: LazyComponent<typeof import("../components/ui/calendar/index")['CalendarHeadCell']>
export const LazyCalendarHeader: LazyComponent<typeof import("../components/ui/calendar/index")['CalendarHeader']>
export const LazyCalendarHeading: LazyComponent<typeof import("../components/ui/calendar/index")['CalendarHeading']>
export const LazyCalendarNextButton: LazyComponent<typeof import("../components/ui/calendar/index")['CalendarNextButton']>
export const LazyCalendarPrevButton: LazyComponent<typeof import("../components/ui/calendar/index")['CalendarPrevButton']>
export const LazyCard: LazyComponent<typeof import("../components/ui/card/index")['Card']>
export const LazyCardAction: LazyComponent<typeof import("../components/ui/card/index")['CardAction']>
export const LazyCardContent: LazyComponent<typeof import("../components/ui/card/index")['CardContent']>
export const LazyCardDescription: LazyComponent<typeof import("../components/ui/card/index")['CardDescription']>
export const LazyCardFooter: LazyComponent<typeof import("../components/ui/card/index")['CardFooter']>
export const LazyCardHeader: LazyComponent<typeof import("../components/ui/card/index")['CardHeader']>
export const LazyCardTitle: LazyComponent<typeof import("../components/ui/card/index")['CardTitle']>
export const LazyCheckbox: LazyComponent<typeof import("../components/ui/checkbox/index")['Checkbox']>
export const LazyDataTable: LazyComponent<typeof import("../components/ui/data-table/index")['DataTable']>
export const LazyDataTableDropdown: LazyComponent<typeof import("../components/ui/data-table/index")['DataTableDropdown']>
export const LazyDialog: LazyComponent<typeof import("../components/ui/dialog/index")['Dialog']>
export const LazyDialogClose: LazyComponent<typeof import("../components/ui/dialog/index")['DialogClose']>
export const LazyDialogContent: LazyComponent<typeof import("../components/ui/dialog/index")['DialogContent']>
export const LazyDialogDescription: LazyComponent<typeof import("../components/ui/dialog/index")['DialogDescription']>
export const LazyDialogFooter: LazyComponent<typeof import("../components/ui/dialog/index")['DialogFooter']>
export const LazyDialogHeader: LazyComponent<typeof import("../components/ui/dialog/index")['DialogHeader']>
export const LazyDialogOverlay: LazyComponent<typeof import("../components/ui/dialog/index")['DialogOverlay']>
export const LazyDialogScrollContent: LazyComponent<typeof import("../components/ui/dialog/index")['DialogScrollContent']>
export const LazyDialogTitle: LazyComponent<typeof import("../components/ui/dialog/index")['DialogTitle']>
export const LazyDialogTrigger: LazyComponent<typeof import("../components/ui/dialog/index")['DialogTrigger']>
export const LazyDropdownMenu: LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenu']>
export const LazyDropdownMenuCheckboxItem: LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuCheckboxItem']>
export const LazyDropdownMenuContent: LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuContent']>
export const LazyDropdownMenuGroup: LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuGroup']>
export const LazyDropdownMenuItem: LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuItem']>
export const LazyDropdownMenuLabel: LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuLabel']>
export const LazyDropdownMenuRadioGroup: LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuRadioGroup']>
export const LazyDropdownMenuRadioItem: LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuRadioItem']>
export const LazyDropdownMenuSeparator: LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuSeparator']>
export const LazyDropdownMenuShortcut: LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuShortcut']>
export const LazyDropdownMenuSub: LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuSub']>
export const LazyDropdownMenuSubContent: LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuSubContent']>
export const LazyDropdownMenuSubTrigger: LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuSubTrigger']>
export const LazyDropdownMenuTrigger: LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuTrigger']>
export const LazyDropdownMenuPortal: LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuPortal']>
export const LazyCombobox: LazyComponent<typeof import("../components/ui/combobox/index")['Combobox']>
export const LazyComboboxAnchor: LazyComponent<typeof import("../components/ui/combobox/index")['ComboboxAnchor']>
export const LazyComboboxEmpty: LazyComponent<typeof import("../components/ui/combobox/index")['ComboboxEmpty']>
export const LazyComboboxGroup: LazyComponent<typeof import("../components/ui/combobox/index")['ComboboxGroup']>
export const LazyComboboxInput: LazyComponent<typeof import("../components/ui/combobox/index")['ComboboxInput']>
export const LazyComboboxItem: LazyComponent<typeof import("../components/ui/combobox/index")['ComboboxItem']>
export const LazyComboboxItemIndicator: LazyComponent<typeof import("../components/ui/combobox/index")['ComboboxItemIndicator']>
export const LazyComboboxList: LazyComponent<typeof import("../components/ui/combobox/index")['ComboboxList']>
export const LazyComboboxSeparator: LazyComponent<typeof import("../components/ui/combobox/index")['ComboboxSeparator']>
export const LazyComboboxViewport: LazyComponent<typeof import("../components/ui/combobox/index")['ComboboxViewport']>
export const LazyComboboxCancel: LazyComponent<typeof import("../components/ui/combobox/index")['ComboboxCancel']>
export const LazyComboboxTrigger: LazyComponent<typeof import("../components/ui/combobox/index")['ComboboxTrigger']>
export const LazyMenubar: LazyComponent<typeof import("../components/ui/menubar/index")['Menubar']>
export const LazyMenubarCheckboxItem: LazyComponent<typeof import("../components/ui/menubar/index")['MenubarCheckboxItem']>
export const LazyMenubarContent: LazyComponent<typeof import("../components/ui/menubar/index")['MenubarContent']>
export const LazyMenubarGroup: LazyComponent<typeof import("../components/ui/menubar/index")['MenubarGroup']>
export const LazyMenubarItem: LazyComponent<typeof import("../components/ui/menubar/index")['MenubarItem']>
export const LazyMenubarLabel: LazyComponent<typeof import("../components/ui/menubar/index")['MenubarLabel']>
export const LazyMenubarMenu: LazyComponent<typeof import("../components/ui/menubar/index")['MenubarMenu']>
export const LazyMenubarRadioGroup: LazyComponent<typeof import("../components/ui/menubar/index")['MenubarRadioGroup']>
export const LazyMenubarRadioItem: LazyComponent<typeof import("../components/ui/menubar/index")['MenubarRadioItem']>
export const LazyMenubarSeparator: LazyComponent<typeof import("../components/ui/menubar/index")['MenubarSeparator']>
export const LazyMenubarShortcut: LazyComponent<typeof import("../components/ui/menubar/index")['MenubarShortcut']>
export const LazyMenubarSub: LazyComponent<typeof import("../components/ui/menubar/index")['MenubarSub']>
export const LazyMenubarSubContent: LazyComponent<typeof import("../components/ui/menubar/index")['MenubarSubContent']>
export const LazyMenubarSubTrigger: LazyComponent<typeof import("../components/ui/menubar/index")['MenubarSubTrigger']>
export const LazyMenubarTrigger: LazyComponent<typeof import("../components/ui/menubar/index")['MenubarTrigger']>
export const LazyPagination: LazyComponent<typeof import("../components/ui/pagination/index")['Pagination']>
export const LazyPaginationContent: LazyComponent<typeof import("../components/ui/pagination/index")['PaginationContent']>
export const LazyPaginationEllipsis: LazyComponent<typeof import("../components/ui/pagination/index")['PaginationEllipsis']>
export const LazyPaginationFirst: LazyComponent<typeof import("../components/ui/pagination/index")['PaginationFirst']>
export const LazyPaginationItem: LazyComponent<typeof import("../components/ui/pagination/index")['PaginationItem']>
export const LazyPaginationLast: LazyComponent<typeof import("../components/ui/pagination/index")['PaginationLast']>
export const LazyPaginationNext: LazyComponent<typeof import("../components/ui/pagination/index")['PaginationNext']>
export const LazyPaginationPrevious: LazyComponent<typeof import("../components/ui/pagination/index")['PaginationPrevious']>
export const LazyInput: LazyComponent<typeof import("../components/ui/input/index")['Input']>
export const LazyProgress: LazyComponent<typeof import("../components/ui/progress/index")['Progress']>
export const LazySelect: LazyComponent<typeof import("../components/ui/select/index")['Select']>
export const LazySelectContent: LazyComponent<typeof import("../components/ui/select/index")['SelectContent']>
export const LazySelectGroup: LazyComponent<typeof import("../components/ui/select/index")['SelectGroup']>
export const LazySelectItem: LazyComponent<typeof import("../components/ui/select/index")['SelectItem']>
export const LazySelectItemText: LazyComponent<typeof import("../components/ui/select/index")['SelectItemText']>
export const LazySelectLabel: LazyComponent<typeof import("../components/ui/select/index")['SelectLabel']>
export const LazySelectScrollDownButton: LazyComponent<typeof import("../components/ui/select/index")['SelectScrollDownButton']>
export const LazySelectScrollUpButton: LazyComponent<typeof import("../components/ui/select/index")['SelectScrollUpButton']>
export const LazySelectSeparator: LazyComponent<typeof import("../components/ui/select/index")['SelectSeparator']>
export const LazySelectTrigger: LazyComponent<typeof import("../components/ui/select/index")['SelectTrigger']>
export const LazySelectValue: LazyComponent<typeof import("../components/ui/select/index")['SelectValue']>
export const LazyPopover: LazyComponent<typeof import("../components/ui/popover/index")['Popover']>
export const LazyPopoverContent: LazyComponent<typeof import("../components/ui/popover/index")['PopoverContent']>
export const LazyPopoverTrigger: LazyComponent<typeof import("../components/ui/popover/index")['PopoverTrigger']>
export const LazyPopoverAnchor: LazyComponent<typeof import("../components/ui/popover/index")['PopoverAnchor']>
export const LazyTable: LazyComponent<typeof import("../components/ui/table/index")['Table']>
export const LazyTableBody: LazyComponent<typeof import("../components/ui/table/index")['TableBody']>
export const LazyTableCaption: LazyComponent<typeof import("../components/ui/table/index")['TableCaption']>
export const LazyTableCell: LazyComponent<typeof import("../components/ui/table/index")['TableCell']>
export const LazyTableEmpty: LazyComponent<typeof import("../components/ui/table/index")['TableEmpty']>
export const LazyTableFooter: LazyComponent<typeof import("../components/ui/table/index")['TableFooter']>
export const LazyTableHead: LazyComponent<typeof import("../components/ui/table/index")['TableHead']>
export const LazyTableHeader: LazyComponent<typeof import("../components/ui/table/index")['TableHeader']>
export const LazyTableRow: LazyComponent<typeof import("../components/ui/table/index")['TableRow']>
export const LazyToaster: LazyComponent<typeof import("../components/ui/sonner/index")['Toaster']>
export const LazyTextarea: LazyComponent<typeof import("../components/ui/textarea/index")['Textarea']>
export const LazyTagsInput: LazyComponent<typeof import("../components/ui/tags-input/index")['TagsInput']>
export const LazyTagsInputInput: LazyComponent<typeof import("../components/ui/tags-input/index")['TagsInputInput']>
export const LazyTagsInputItem: LazyComponent<typeof import("../components/ui/tags-input/index")['TagsInputItem']>
export const LazyTagsInputItemDelete: LazyComponent<typeof import("../components/ui/tags-input/index")['TagsInputItemDelete']>
export const LazyTagsInputItemText: LazyComponent<typeof import("../components/ui/tags-input/index")['TagsInputItemText']>
export const LazyNuxtPage: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/pages/runtime/page")['default']>
export const LazyNoScript: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/head/runtime/components")['NoScript']>
export const LazyLink: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/head/runtime/components")['Link']>
export const LazyBase: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/head/runtime/components")['Base']>
export const LazyTitle: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/head/runtime/components")['Title']>
export const LazyMeta: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/head/runtime/components")['Meta']>
export const LazyStyle: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/head/runtime/components")['Style']>
export const LazyHead: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/head/runtime/components")['Head']>
export const LazyHtml: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/head/runtime/components")['Html']>
export const LazyBody: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/head/runtime/components")['Body']>
export const LazyNuxtIsland: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/nuxt-island")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<IslandComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.6_@parcel+watcher_daf8d3ebc5a0cd5ed58f3c3ddddc14c4/node_modules/nuxt/dist/app/components/server-placeholder")['default']>>

export const componentNames: string[]
