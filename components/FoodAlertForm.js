"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const foodAlertSchema = z.object({
	giveawayName: z.string().min(1, "Required"),
	orgName: z.string().min(1, "Required"),
	city: z.string().min(1, "Required"),
	address: z.string().min(1, "Required"),
	description: z.string().min(1, "Required"),
	foodType: z.enum(["veg", "nonVeg"]),
	startTime: z.string().min(1, "Required"),
	endTime: z.string().min(1, "Required"),
	slots: z.coerce.number().min(1, "Must be at least 1"),
	picture: z
		.any()
		.refine((file) => file instanceof File, { message: "Image required" }),
});



export default function FoodAlertForm() {
	const [imagePreview, setImagePreview] = (useState < string) | (null > null);

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm <
	FoodAlertFormData >
	{
		resolver: zodResolver(foodAlertSchema),
	};

	const onSubmit = (data) => {
		console.log("Form Data:", data);
	};

	return (
		<div className="bg-black text-white p-6 rounded-xl shadow-lg max-w-2xl mx-auto border-2 border-white">
			<h2 className="text-center text-2xl mb-4 font-bold">
				Food Giveaway Page
			</h2>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				<div className="grid grid-cols-2 gap-4">
					<div>
						<Label className="text-lg">Name</Label>
						<Input
							className="border-white text-white bg-black"
							{...register("giveawayName")}
						/>
						<p className="text-red-500 text-sm">
							{errors.giveawayName?.message}
						</p>
					</div>
					<div>
						<Label className="text-lg">Organizer</Label>
						<Input
							className="border-white text-white bg-black"
							{...register("orgName")}
						/>
						<p className="text-red-500 text-sm">
							{errors.orgName?.message}
						</p>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div>
						<Label className="text-lg">City</Label>
						<Input
							className="border-white text-white bg-black"
							{...register("city")}
						/>
						<p className="text-red-500 text-sm">
							{errors.city?.message}
						</p>
					</div>
					<div>
						<Label className="text-lg">Address</Label>
						<Input
							className="border-white text-white bg-black"
							{...register("address")}
						/>
						<p className="text-red-500 text-sm">
							{errors.address?.message}
						</p>
					</div>
				</div>

				<div>
					<Label className="text-lg">Pictures</Label>
					<Input
						type="file"
						className="border-white text-white bg-black"
						accept="image/*"
						onChange={(e) => {
							const file = e.target.files?.[0];
							if (file) {
								setValue("picture", file);
								setImagePreview(URL.createObjectURL(file));
							}
						}}
					/>
					{imagePreview && (
						<img
							src={imagePreview}
							alt="preview"
							className="mt-2 h-24"
						/>
					)}
				</div>

				<div>
					<Label className="text-lg">Description</Label>
					<Textarea
						className="border-white text-white bg-black"
						{...register("description")}
					/>
				</div>

				<div>
					<Label className="text-lg">Food Type</Label>
					<RadioGroup
						className="flex space-x-4"
						onValueChange={(val) => setValue("foodType", val)}>
						<RadioGroupItem value="veg" id="veg" />
						<Label htmlFor="veg">Veg</Label>
						<RadioGroupItem value="nonVeg" id="nonVeg" />
						<Label htmlFor="nonVeg">Non-Veg</Label>
					</RadioGroup>
					<p className="text-red-500 text-sm">
						{errors.foodType?.message}
					</p>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div>
						<Label className="text-lg">Start Time</Label>
						<Input
							type="time"
							className="border-white text-white bg-black"
							{...register("startTime")}
						/>
					</div>
					<div>
						<Label className="text-lg">End Time</Label>
						<Input
							type="time"
							className="border-white text-white bg-black"
							{...register("endTime")}
						/>
					</div>
				</div>

				<div>
					<Label className="text-lg">No. of Slots Available</Label>
					<Input
						type="number"
						className="border-white text-white bg-black"
						{...register("slots")}
						min={1}
					/>
				</div>

				<Button
					type="submit"
					className="w-full bg-white text-black hover:bg-gray-300">
					Start Giveaway
				</Button>
			</form>
		</div>
	);
}
