import PropTypes from "prop-types";
import { Fragment, memo, useState } from "react";

import PopoverWithTrigger from "metabase/common/components/PopoverWithTrigger";
import Toggle from "metabase/common/components/Toggle";
import { lighten } from "metabase/lib/colors";
import { Icon, Tooltip } from "metabase/ui";

import {
  ActionsList,
  DisabledPermissionOption,
  OptionsList,
  OptionsListItem,
  PermissionsSelectRoot,
  SelectedOption,
  ToggleContainer,
  ToggleLabel,
  WarningIcon,
} from "./PermissionsSelect.styled";
import {
  PermissionsSelectOption,
  optionShape,
} from "./PermissionsSelectOption";

const propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape(optionShape)).isRequired,
  actions: PropTypes.object,
  value: PropTypes.string.isRequired,
  toggleLabel: PropTypes.string,
  hasChildren: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onAction: PropTypes.func,
  isDisabled: PropTypes.bool,
  isHighlighted: PropTypes.bool,
  disabledTooltip: PropTypes.string,
  warning: PropTypes.string,
};

export const PermissionsSelect = memo(function PermissionsSelect({
  options,
  actions,
  value,
  toggleLabel,
  hasChildren,
  onChange,
  onAction,
  isDisabled,
  disabledTooltip,
  warning,
  isHighlighted,
}) {
  const [toggleState, setToggleState] = useState(false);
  const selectedOption = options.find((option) => option.value === value);
  const selectableOptions = hasChildren
    ? options
    : options.filter((option) => option !== selectedOption);

  const selectedOptionValue = (
    <PermissionsSelectRoot
      isDisabled={isDisabled}
      aria-haspopup="listbox"
      data-testid="permissions-select"
    >
      {isDisabled ? (
        <DisabledPermissionOption
          {...selectedOption}
          isHighlighted={isHighlighted}
          hint={disabledTooltip}
          iconColor="text-light"
        />
      ) : (
        <SelectedOption {...selectedOption} />
      )}

      {warning && (
        <Tooltip label={warning}>
          <WarningIcon />
        </Tooltip>
      )}

      <Icon
        style={{ visibility: isDisabled ? "hidden" : "visible" }}
        name="chevrondown"
        size={16}
        color={lighten("text-light", 0.15)}
      />
    </PermissionsSelectRoot>
  );

  const actionsForCurrentValue = actions?.[selectedOption?.value] || [];
  const hasActions = actionsForCurrentValue.length > 0;

  return (
    <PopoverWithTrigger
      disabled={isDisabled}
      triggerElement={selectedOptionValue}
      onClose={() => setToggleState(false)}
      targetOffsetX={16}
      targetOffsetY={8}
    >
      {({ onClose }) => (
        <Fragment>
          <OptionsList role="listbox">
            {selectableOptions.map((option) => (
              <OptionsListItem
                role="option"
                key={option.value}
                onClick={() => {
                  onClose();
                  onChange(option.value, toggleLabel ? toggleState : null);
                }}
              >
                <PermissionsSelectOption {...option} />
              </OptionsListItem>
            ))}
          </OptionsList>
          {hasActions && (
            <ActionsList>
              {actionsForCurrentValue.map((action, index) => (
                <OptionsListItem
                  key={index}
                  role="option"
                  onClick={() => {
                    onClose();
                    onAction(action);
                  }}
                >
                  <PermissionsSelectOption {...action} />
                </OptionsListItem>
              ))}
            </ActionsList>
          )}

          {hasChildren && (
            <ToggleContainer>
              <ToggleLabel>{toggleLabel}</ToggleLabel>
              <Toggle small value={toggleState} onChange={setToggleState} />
            </ToggleContainer>
          )}
        </Fragment>
      )}
    </PopoverWithTrigger>
  );
});

PermissionsSelect.propTypes = propTypes;
