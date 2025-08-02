import Link from "next/link";

export default function NavBar() {
    return (
        <nav className="bg-green-700 p-4">
            <div>
                <div className="text-white text-3xl font-semibold">
                    The<span className="text-green-400">Melvi</span>Tron
                </div>
            </div>
            
                <ul className="flex space-x-4">
                    <li>
                        <Link href="/" className="text-gray-300 font-semibold hover:text-white">Home</Link>
                    </li>
                    <li>
                        <Link href="/LinearRegressionII" className="text-gray-300 font-semibold hover:text-white">Linear Regression</Link>
                    </li>
                </ul>
        </nav>
    );
}