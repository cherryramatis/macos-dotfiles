#!/usr/bin/env node

/*
 * Format with: prettier --write karabiner.js
 */

function fromTo(from, to) {
  return [
    {
      from: {
        key_code: from,
      },
      to: {
        key_code: to,
      },
    },
  ];
}

function spaceFN(from, to) {
  return [
    {
      from: {
        modifiers: {
          optional: ["any"],
        },
        simultaneous: [
          {
            key_code: "spacebar",
          },
          {
            key_code: from,
          },
        ],
        simultaneous_options: {
          key_down_order: "strict",
          key_up_order: "strict_inverse",
          to_after_key_up: [
            {
              set_variable: {
                name: "SpaceFN",
                value: 0,
              },
            },
          ],
        },
      },
      parameters: {
        "basic.simultaneous_threshold_milliseconds": 500 /* Default: 1000 */,
      },
      to: [
        {
          set_variable: {
            name: "SpaceFN",
            value: 1,
          },
        },
        {
          key_code: to,
        },
      ],
      type: "basic",
    },
    {
      conditions: [
        {
          name: "SpaceFN",
          type: "variable_if",
          value: 1,
        },
      ],
      from: {
        key_code: from,
        modifiers: {
          optional: ["any"],
        },
      },
      to: [
        {
          key_code: to,
        },
      ],
      type: "basic",
    },
  ];
}

function swap(a, b) {
  return [...fromTo(a, b), ...fromTo(b, a)];
}

const DEVICE_DEFAULTS = {
  disable_built_in_keyboard_if_exists: false,
  fn_function_keys: [],
  ignore: false,
  manipulate_caps_lock_led: true,
  simple_modifications: [],
};

const IDENTIFIER_DEFAULTS = {
  is_keyboard: true,
  is_pointing_device: false,
};

const APPLE_INTERNAL = {
  ...DEVICE_DEFAULTS,
  identifiers: {
    ...IDENTIFIER_DEFAULTS,
    product_id: 628,
    vendor_id: 1452,
  },
};

const REALFORCE = {
  ...DEVICE_DEFAULTS,
  identifiers: {
    ...IDENTIFIER_DEFAULTS,
    product_id: 273,
    vendor_id: 2131,
  },
  simple_modifications: [
    ...swap("left_command", "left_option"),
    ...swap("right_command", "right_option"),
    ...fromTo("application", "fn"),
    ...fromTo("pause", "power"),
  ],
};

const YUBIKEY = {
  ...DEVICE_DEFAULTS,
  identifiers: {
    ...IDENTIFIER_DEFAULTS,
    product_id: 1031,
    vendor_id: 4176,
  },
  ignore: true,
  manipulate_caps_lock_led: false,
};

const PARAMETER_DEFAULTS = {
  "basic.simultaneous_threshold_milliseconds": 50,
  "basic.to_delayed_action_delay_milliseconds": 500,
  "basic.to_if_alone_timeout_milliseconds": 1000,
  "basic.to_if_held_down_threshold_milliseconds": 500,
};

const VANILLA_PROFILE = {
  complex_modifications: {
    parameters: PARAMETER_DEFAULTS,
    rules: [],
  },
  devices: [YUBIKEY],
  fn_function_keys: [
    ...fromTo("f1", "display_brightness_decrement"),
    ...fromTo("f2", "display_brightness_increment"),
    ...fromTo("f3", "mission_control"),
    ...fromTo("f4", "launchpad"),
    ...fromTo("f5", "illumination_decrement"),
    ...fromTo("f6", "illumination_increment"),
    ...fromTo("f7", "rewind"),
    ...fromTo("f8", "play_or_pause"),
    ...fromTo("f9", "fastforward"),
    ...fromTo("f10", "mute"),
    ...fromTo("f11", "volume_decrement"),
    ...fromTo("f12", "volume_increment"),
  ],
  name: "Vanilla",
  selected: false,
  simple_modifications: [],
  virtual_hid_keyboard: {
    caps_lock_delay_milliseconds: 0,
    keyboard_type: "ansi",
  },
};

const DEFAULT_PROFILE = {
  ...VANILLA_PROFILE,
  complex_modifications: {
    parameters: {
      ...PARAMETER_DEFAULTS,
      "basic.to_if_alone_timeout_milliseconds": 500 /* Default: 1000 */,
    },
    rules: [
      {
        description: "SpaceFN layer",
        manipulators: [
          ...spaceFN("b", "spacebar"),
          ...spaceFN("h", "left_arrow"),
          ...spaceFN("j", "down_arrow"),
          ...spaceFN("k", "up_arrow"),
          ...spaceFN("l", "right_arrow"),
          ...spaceFN("1", "display_brightness_decrement"),
          ...spaceFN("2", "display_brightness_increment"),
          ...spaceFN("3", "mission_control"),
          ...spaceFN("4", "launchpad"),
          ...spaceFN("5", "illumination_decrement"),
          ...spaceFN("6", "illumination_increment"),
          ...spaceFN("7", "rewind"),
          ...spaceFN("8", "play_or_pause"),
          ...spaceFN("9", "fast_forward"),
          ...spaceFN("0", "mute"),
          ...spaceFN("-", "volume_decrement"),
          ...spaceFN("=", "volume_increment"),
          ...spaceFN("d", "PageDown"),
          ...spaceFN("u", "PageUp"),
        ],
      },
      {
        description: "Post Esc if Caps is tapped, Control if held",
        manipulators: [
          {
            from: {
              key_code: "left_control",
              modifiers: {
                optional: ["any"],
              },
            },
            to: [
              {
                key_code: "left_control",
                lazy: true,
              },
            ],
            to_if_alone: [
              {
                key_code: "escape",
              },
            ],
            type: "basic",
          },
        ],
      },
      {
        description:
          "Change Return to Control when used as modifier, Return when used alone",
        manipulators: [
          {
            from: {
              key_code: "return_or_enter",
              modifiers: {
                optional: ["any"],
              },
            },
            to: [
              {
                key_code: "right_command",
                lazy: true,
              },
            ],
            to_if_alone: [
              {
                key_code: "return_or_enter",
              },
            ],
            to_if_held_down: [
              {
                key_code: "return_or_enter",
              },
            ],
            type: "basic",
          },
        ],
      },
      {
        description:
          "Change Tab to Option when used as modifier, Tab when used alone",
        manipulators: [
          {
            from: {
              key_code: "tab",
              modifiers: {
                optional: ["any"],
              },
            },
            to: [
              {
                key_code: "left_option",
                lazy: true,
              },
            ],
            to_if_alone: [
              {
                key_code: "tab",
              },
            ],
            to_if_held_down: [
              {
                key_code: "left_option",
              },
            ],
            type: "basic",
          },
        ],
      },
      {
        description: "Left and Right Shift together toggle Caps Lock",
        manipulators: [
          {
            from: {
              modifiers: {
                optional: ["any"],
              },
              simultaneous: [
                {
                  key_code: "left_shift",
                },
                {
                  key_code: "right_shift",
                },
              ],
              simultaneous_options: {
                key_down_order: "insensitive",
                key_up_order: "insensitive",
              },
            },
            to: [
              {
                key_code: "caps_lock",
              },
            ],
            type: "basic",
          },
        ],
      },
    ],
  },
  devices: [YUBIKEY, REALFORCE, APPLE_INTERNAL],
  name: "Default",
  selected: true,
  simple_modifications: [
    {
      from: {
        key_code: "caps_lock",
      },
      to: {
        key_code: "left_control",
      },
    },
    {
      from: {
        key_code: "escape",
      },
      to: {
        key_code: "caps_lock",
      },
    },
  ],
};

process.stdout.write(
  JSON.stringify(
    {
      global: {
        check_for_updates_on_startup: true,
        show_in_menu_bar: true,
        show_profile_name_in_menu_bar: false,
      },
      profiles: [DEFAULT_PROFILE, VANILLA_PROFILE],
    },
    null,
    2
  ) + "\n"
);
