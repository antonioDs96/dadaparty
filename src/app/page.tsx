import Form from "@/components/Form/Form";
import Heading from "@/components/Heading/Heading";

export default function Home() {
    return (
        <main className="flex fit flex-col items-center p-8 lg:gap-6 gap-12">
            <Heading/>
            <Form/>
        </main>
    )
}
