"use client";

import { Button as ButtonRender } from "@/components/ui/button";
import { Badge as BadgeRender } from "@/components/ui/badge";
import { Badge } from "@/components/ui-editor/badge";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui-editor/accordion";

import { useStyleManagerStore } from "@/store/useStyleManagerStore";

import type { ButtonSizeName, ButtonVariantName } from "@/types/button";
import type { ComponentType } from "@/types/style";
import type { BadgeVariantName } from "@/types/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui-editor/select";
import { Label } from "../ui-editor/label";

function ComponentWrapper({
	component,
	componentType,
}: {
	component: {
		componentText: string;
		variant: string;
		size?: string;
	};
	componentType: ComponentType;
}) {
	const { styles } = useStyleManagerStore();
	const componentStyle = styles[componentType];
	const variantStyle = componentStyle.variant[component.variant];
	const sizeStyle =
		componentType === "button" && componentStyle.size && component.size
			? componentStyle.size[component.size]
			: null;

	const extraStyles = Object.entries(variantStyle)
		//@ts-ignore
		.filter(([_, group]) => group.isApplied)
		//@ts-ignore
		.flatMap(([_, group]) => Object.values(group.properties))
		.concat(
			sizeStyle
				? Object.entries(sizeStyle)
						//@ts-ignore
						.filter(([_, group]) => group.isApplied)
						//@ts-ignore
						.flatMap(([_, group]) => Object.values(group.properties))
				: [],
		);

	const className = extraStyles.join(" ");

	switch (componentType) {
		case "button":
			return (
				<ButtonRender
					variant={component.variant as ButtonVariantName}
					size={component.size as ButtonSizeName}
					className={className}
				>
					{component.componentText}
				</ButtonRender>
			);
		case "badge":
			return (
				<BadgeRender
					variant={component.variant as BadgeVariantName}
					className={className}
				>
					{component.componentText}
				</BadgeRender>
			);
		default:
			return null;
	}
}

export default function ComponentRender({
	openVariants,
	setOpenVariants,
}: {
	openVariants: (ButtonVariantName & BadgeVariantName)[];
	setOpenVariants: (value: (ButtonVariantName & BadgeVariantName)[]) => void;
}) {
	const { styles, componentText, currentComponent, setCurrentComponent } =
		useStyleManagerStore();

	return (
		<div className="p-6 w-full max-w-[600px] flex flex-col gap-2 items-stretch overflow-x-auto">
			<div className="flex flex-col gap-4">
				<Label className="font-semibold ml-1"> Selected Component</Label>
				<Select
					value={currentComponent}
					onValueChange={(value) => setCurrentComponent(value as ComponentType)}
				>
					<SelectTrigger>
						<SelectValue placeholder="Component" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="button">Button</SelectItem>
						<SelectItem value="badge">Badge</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<Accordion
				type="multiple"
				className="w-full min-w-fit"
				value={openVariants}
				onValueChange={setOpenVariants}
			>
				{Object.entries(styles[currentComponent].variant).map(
					([variantName, variantStyle]) => (
						<AccordionItem
							value={variantName}
							key={`variant-${variantName}`}
							className="flex flex-col gap-2 p-2"
						>
							<AccordionTrigger>{variantName}</AccordionTrigger>
							<AccordionContent>
								<div className="flex gap-2 pb-4">
									{currentComponent === "button" && styles.button.size ? (
										Object.keys(styles.button.size).map((sizeName) => (
											<div
												key={`variant-${variantName}-${sizeName}`}
												className="p-2 flex flex-col justify-between items-center gap-2"
											>
												<ComponentWrapper
													component={{
														componentText,
														variant: variantName,
														size: sizeName,
													}}
													componentType={currentComponent}
												/>
												<Badge variant="outline">{sizeName}</Badge>
											</div>
										))
									) : (
										<div className="p-2 flex flex-col justify-between items-center gap-2">
											<ComponentWrapper
												component={{
													componentText,
													variant: variantName,
												}}
												componentType={currentComponent}
											/>
										</div>
									)}
								</div>
							</AccordionContent>
						</AccordionItem>
					),
				)}
			</Accordion>
		</div>
	);
}
