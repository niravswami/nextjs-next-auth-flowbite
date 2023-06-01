import React from "react";
import classNames from "classnames";
import { forwardRef } from "react";
import { HelperText, useTheme } from "flowbite-react";
import { mergeDeep } from "@/helpers/mergeDeep";

export const CustomTextInput = forwardRef(
	(
		{
			addon,
			className,
			color = "gray",
			helperText,
			icon: Icon,
			rightIcon: RightIcon,
			shadow,
			sizing = "md",
			theme: customTheme = {},
			addonEnd,
			...props
		},
		ref
	) => {
		const theme = mergeDeep(useTheme().theme.textInput, customTheme);

		return (
			<>
				<div className={classNames(theme.base, className)}>
					{addon && <span className={theme.addon}>{addon}</span>}
					<div className={theme.field.base}>
						{Icon && (
							<div className={theme.field.icon.base}>
								<Icon className={theme.field.icon.svg} />
							</div>
						)}
						{RightIcon && (
							<div
								data-testid="right-icon"
								className={theme.field.rightIcon.base}
							>
								<RightIcon className={theme.field.rightIcon.svg} />
							</div>
						)}
						<input
							className={classNames(
								theme.field.input.base,
								theme.field.input.colors[color],
								theme.field.input.withIcon[Icon ? "on" : "off"],
								theme.field.input.withAddon[addon ? "on" : "off"],
								theme.field.input.withShadow[shadow ? "on" : "off"],
								theme.field.input.sizes[sizing],
								addonEnd ? "rounded-none rounded-l-lg min-w-0 w-full " : ""
							)}
							{...props}
							ref={ref}
						/>
					</div>
					{addonEnd && (
						<span
							className={`inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-l-0 border-gray-300 rounded-r-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600`}
						>
							{addonEnd}
						</span>
					)}
				</div>
				{helperText && <HelperText color={color}>{helperText}</HelperText>}
			</>
		);
	}
);

CustomTextInput.displayName = "TextInput";
