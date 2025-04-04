"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const foodAlertSchema = z.object({
	restaurantName: z.string().min(1, "Restaurant name is required"),
	foodType: z.string().min(1, "Food type is required"),
	quantity: z.number().min(1, "Quantity must be at least 1"),
	discount: z.string().optional(),
});

const FoodAlertForm = () => {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm({
		resolver: zodResolver(foodAlertSchema),
	});

	const onSubmit = (data) => {
		console.log("Submitted Data:", data);
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="space-y-4 p-4 border rounded">
			<div>
				<label className="block text-sm font-medium">
					Restaurant Name
				</label>
				<input
					{...register("restaurantName")}
					className="w-full p-2 border rounded"
					placeholder="Enter restaurant name"
				/>
				{errors.restaurantName && (
					<p className="text-red-500">
						{errors.restaurantName.message}
					</p>
				)}
			</div>

			<div>
				<label className="block text-sm font-medium">Food Type</label>
				<input
					{...register("foodType")}
					className="w-full p-2 border rounded"
					placeholder="Enter food type"
				/>
				{errors.foodType && (
					<p className="text-red-500">{errors.foodType.message}</p>
				)}
			</div>

			<div>
				<label className="block text-sm font-medium">Quantity</label>
				<input
					type="number"
					{...register("quantity", { valueAsNumber: true })}
					className="w-full p-2 border rounded"
					placeholder="Enter quantity"
				/>
				{errors.quantity && (
					<p className="text-red-500">{errors.quantity.message}</p>
				)}
			</div>
			<button
				type="submit"
				className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
				Submit
			</button>
		</form>
	);
};

export default FoodAlertForm;
