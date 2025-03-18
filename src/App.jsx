import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, differenceInWeeks, addYears } from 'date-fns';

export default function App() {
	const [dob, setDob] = useState('');
	const [lifeExpectancy, setLifeExpectancy] = useState(80);
	const [weeksLived, setWeeksLived] = useState(0);
	const [totalWeeks, setTotalWeeks] = useState(0);
	const [generated, setGenerated] = useState(false);

	useEffect(() => {
		const storedDob = localStorage.getItem('dob');
		const storedLifeExpectancy = localStorage.getItem('lifeExpectancy');
		if (storedDob && storedLifeExpectancy) {
			setDob(storedDob);
			setLifeExpectancy(parseInt(storedLifeExpectancy));
		}
	}, []);

	const calculateWeeks = () => {
		if (!dob || !lifeExpectancy) return;
		localStorage.setItem('dob', dob);
		localStorage.setItem('lifeExpectancy', lifeExpectancy);

		const birthDate = new Date(dob);
		const today = new Date();
		const endOfLife = addYears(birthDate, parseInt(lifeExpectancy));

		const weeksLived = differenceInWeeks(today, birthDate);
		const totalWeeks = differenceInWeeks(endOfLife, birthDate);

		setWeeksLived(weeksLived);
		setTotalWeeks(totalWeeks);
		setGenerated(true);
	};

	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4'>
			<div className='bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full text-center'>
				<h1 className='text-2xl font-bold mb-4'>Life in Weeks</h1>
				<input
					type='date'
					value={dob}
					onChange={(e) => setDob(e.target.value)}
					className='w-full p-2 mb-4 rounded bg-gray-700 border border-gray-600 focus:ring focus:ring-gray-500'
				/>
				<input
					type='number'
					value={lifeExpectancy}
					onChange={(e) => setLifeExpectancy(e.target.value)}
					placeholder='Expected years to live'
					className='w-full p-2 mb-4 rounded bg-gray-700 border border-gray-600 focus:ring focus:ring-green-500'
				/>
				<button
					onClick={calculateWeeks}
					className='w-full p-2 bg-gray-500 hover:bg-gray-600 rounded font-bold transition-colors'
				>
					Generate Weeks
				</button>
			</div>
			{generated && (
				<div className='flex flex-col items-center p-6'>
					<h1 className='text-2xl font-bold mb-4'>Your Life in Weeks</h1>
					<div className='mt-6 p-4 max-w-6xl'>
						<div
							className='grid gap-2'
							style={{
								display: 'grid',
								gridTemplateColumns: 'repeat(52, minmax(0, 4fr))',
								width: '100%',
							}}
						>
							{[...Array(totalWeeks)].map((_, index) => (
								<motion.div
									key={index}
									initial={{ opacity: 0, scale: 0.5 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ delay: index * 0.005 }}
									className={`w-4 h-4 rounded-sm border border-gray-800 ${
										index < weeksLived
											? 'bg-gray-300'
											: 'bg-transparent border-white'
									}`}
								></motion.div>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
