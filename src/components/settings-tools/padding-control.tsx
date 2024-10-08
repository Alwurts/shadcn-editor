import React from "react";
import { SelectList } from "./select-list";
import {
	PADDING_CLASSNAMES,
	PADDING_X_CLASSNAMES,
	PADDING_Y_CLASSNAMES,
	PADDING_LEFT_CLASSNAMES,
	PADDING_RIGHT_CLASSNAMES,
	PADDING_TOP_CLASSNAMES,
	PADDING_BOTTOM_CLASSNAMES,
} from "@/lib/tailwind/tailwindClasses/index";
import type { TailwindPaddingGroup } from "@/types/tailwind/tailwind";
import GroupContainer from "@/components/element-composer/node-editor/GroupContainer";
import { useComposerStore } from "@/store/useComposerStore";
import {
	ToggleGroup,
	ToggleGroupItem,
} from "@/components/ui-editor/toggle-group";
import { cn } from "@/lib/utils";
import { Label } from "../ui-editor/label";
import { Square, ArrowLeftRight, ArrowUpDown, Maximize2 } from "lucide-react";

type PaddingControlProps = {
	value: TailwindPaddingGroup;
	nodeKey: string;
};

export function PaddingControl({ value, nodeKey }: PaddingControlProps) {
	const setClassNameGroup = useComposerStore(
		(state) => state.setClassNameGroup,
	);

	const paddingType =
		"padding" in value ? "single" : "paddingX" in value ? "xy" : "sides";

	const getPaddingValue = (className: string) => className.split("-")[1];

	const handleTypeChange = (newType: "single" | "xy" | "sides") => {
		let newValue: TailwindPaddingGroup;

		if (newType === "single") {
			if ("padding" in value) {
				newValue = value;
			} else if ("paddingX" in value) {
				newValue = { padding: `p-${getPaddingValue(value.paddingX)}` };
			} else {
				newValue = { padding: `p-${getPaddingValue(value.paddingLeft)}` };
			}
		} else if (newType === "xy") {
			if ("padding" in value) {
				const paddingValue = getPaddingValue(value.padding);
				newValue = {
					paddingX: `px-${paddingValue}`,
					paddingY: `py-${paddingValue}`,
				};
			} else if ("paddingX" in value) {
				newValue = value;
			} else {
				newValue = {
					paddingX: `px-${getPaddingValue(value.paddingLeft)}`,
					paddingY: `py-${getPaddingValue(value.paddingTop)}`,
				};
			}
		} else {
			if ("padding" in value) {
				const paddingValue = getPaddingValue(value.padding);
				newValue = {
					paddingLeft: `pl-${paddingValue}`,
					paddingRight: `pr-${paddingValue}`,
					paddingTop: `pt-${paddingValue}`,
					paddingBottom: `pb-${paddingValue}`,
				};
			} else if ("paddingX" in value) {
				newValue = {
					paddingLeft: `pl-${getPaddingValue(value.paddingX)}`,
					paddingRight: `pr-${getPaddingValue(value.paddingX)}`,
					paddingTop: `pt-${getPaddingValue(value.paddingY)}`,
					paddingBottom: `pb-${getPaddingValue(value.paddingY)}`,
				};
			} else {
				newValue = value;
			}
		}

		setClassNameGroup(nodeKey, "padding", newValue);
	};

	const handlePaddingChange = (newPadding: Partial<TailwindPaddingGroup>) => {
		setClassNameGroup(nodeKey, "padding", { ...value, ...newPadding });
	};

	const getSideValue = (side: "Left" | "Right" | "Top" | "Bottom") => {
		if ("padding" in value) {
			return `p${side[0].toLowerCase()}-${getPaddingValue(value.padding)}`;
		}
		if ("paddingX" in value) {
			return side === "Left" || side === "Right"
				? `p${side[0].toLowerCase()}-${getPaddingValue(value.paddingX)}`
				: `p${side[0].toLowerCase()}-${getPaddingValue(value.paddingY)}`;
		}
		return (
			value[`padding${side}` as keyof typeof value] ||
			`p${side[0].toLowerCase()}-0`
		);
	};

	return (
		<div className="flex flex-col gap-3">
			<div className="grid grid-cols-3 gap-2">
				<Label htmlFor="paddingType" className="text-sm font-medium col-span-1 py-1">
					Padding
				</Label>
				<ToggleGroup
					id="paddingType"
					type="single"
					variant="outline"
					size="sm"
					className="gap-2 col-span-2"
					value={paddingType}
					onValueChange={(v) =>
						handleTypeChange(v as "single" | "xy" | "sides")
					}
				>
					<ToggleGroupItem value="single" aria-label="Single padding">
						<Square className="w-4 h-4" />
					</ToggleGroupItem>
					<ToggleGroupItem value="xy" aria-label="X and Y padding">
						<ArrowLeftRight className="w-4 h-4" />
					</ToggleGroupItem>
					<ToggleGroupItem value="sides" aria-label="All sides padding">
						<Maximize2 className="w-4 h-4" />
					</ToggleGroupItem>
				</ToggleGroup>
			</div>
			<div className="grid grid-cols-2 gap-2">
				{paddingType === "single" && (
					<SelectList
						id="padding"
						value={"padding" in value ? value.padding : "p-0"}
						onValueChange={(v) => handlePaddingChange({ padding: v })}
						options={PADDING_CLASSNAMES}
						label="Padding"
						className="col-span-2"
					/>
				)}
				{paddingType === "xy" && (
					<>
						<SelectList
							id="paddingX"
							value={"paddingX" in value ? value.paddingX : "px-0"}
							onValueChange={(v) => handlePaddingChange({ paddingX: v })}
							options={PADDING_X_CLASSNAMES}
							label="Padding X"
						/>
						<SelectList
							id="paddingY"
							value={"paddingY" in value ? value.paddingY : "py-0"}
							onValueChange={(v) => handlePaddingChange({ paddingY: v })}
							options={PADDING_Y_CLASSNAMES}
							label="Padding Y"
						/>
					</>
				)}
				{paddingType === "sides" && (
					<>
						{(["Left", "Right", "Top", "Bottom"] as const).map((side) => (
							<SelectList
								key={side}
								id={`padding${side}`}
								value={getSideValue(side)}
								onValueChange={(v) =>
									handlePaddingChange({
										[`padding${side}`]: v,
									} as Partial<TailwindPaddingGroup>)
								}
								options={
									side === "Left"
										? PADDING_LEFT_CLASSNAMES
										: side === "Right"
											? PADDING_RIGHT_CLASSNAMES
											: side === "Top"
												? PADDING_TOP_CLASSNAMES
												: PADDING_BOTTOM_CLASSNAMES
								}
								label={`Padding ${side}`}
							/>
						))}
					</>
				)}
			</div>
		</div>
	);
}
