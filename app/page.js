import Dashboard from "@/components/Dashboard";
import FoodAlertCard from "@/components/FoodAlertCard";
import FoodAlertForm from "@/components/FoodAlertForm";

export default function Home() {
	return (
		//? if user
		// user page
		<main>
			<FoodAlertForm />
			<FoodAlertCard />
			//? else if donater
			<Dashboard />
		</main>
	);
}
