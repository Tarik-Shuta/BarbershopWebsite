import enterijer from "../assets/benterijer.png";

export default function Home() {
    return (
        <section
            className="min-h-screen relative bg-cover bg-center flex items-center"
            style={{ backgroundImage: `url(${enterijer})` }}
        >
        <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black/90 to-transparent"></div>

    <div className="ml-20 text-white">
                <h1 className="text-6xl font-bold">Urban Barbershop</h1>
                <p className="mt-4 text-xl">
                    Experience the perfect haircut.
                </p>
            </div>
            <div className="absolute bottom-0 inset-x-0 h-40 bg-linear-to-t from-black/90 to-transparent"></div>
        </section>
    );
}