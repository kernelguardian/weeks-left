import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, differenceInWeeks, addYears, getYear } from 'date-fns';

export default function App() {
	const [dob, setDob] = useState('');
	const [lifeExpectancy, setLifeExpectancy] = useState(80);
	const [weeksLived, setWeeksLived] = useState(0);
	const [totalWeeks, setTotalWeeks] = useState(0);
	const [generated, setGenerated] = useState(false);
	const [yearLabels, setYearLabels] = useState([]);

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

		// Generate year labels
		const birthYear = getYear(birthDate);
		const yearsToShow = Math.ceil(totalWeeks / 52);
		const years = Array.from({ length: yearsToShow }, (_, i) => birthYear + i);

		setWeeksLived(weeksLived);
		setTotalWeeks(totalWeeks);
		setYearLabels(years);
		setGenerated(true);
	};

	// Create week numbers for column headers (1-52)
	const weekHeaders = Array.from({ length: 52 }, (_, i) => i + 1);

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
					className='w-full p-2 mb-4 rounded bg-gray-700 border border-gray-600 focus:ring focus:ring-gray-500'
				/>
				<button
					onClick={calculateWeeks}
					className='w-full p-2 bg-gray-500 hover:bg-gray-600 rounded font-bold transition-colors'
				>
					Get Insights
				</button>
			</div>
			{generated && (
				<div className='flex flex-col items-center p-6'>
					<h1 className='text-2xl font-bold mb-4'>Your life so far</h1>
					<div className='mt-6 p-4 max-w-6xl'>
						{/* Week number headers */}
						<div className='flex'>
							{/* Empty space for year labels alignment */}
							<div className='w-12 flex-shrink-0'></div>

							<div
								className='grid gap-2 mb-2 text-xs text-gray-400'
								style={{
									display: 'grid',
									gridTemplateColumns: 'repeat(52, minmax(0, 4fr))',
									width: '100%',
								}}
							>
								{weekHeaders.map((weekNum) => (
									<div key={`header-${weekNum}`} className='text-center'>
										{weekNum}
									</div>
								))}
							</div>
						</div>

						{/* Calendar grid with year labels */}
						<div className='flex'>
							{/* Year labels column */}
							<div className='flex flex-col mr-2 text-xs text-gray-400 justify-start w-12 flex-shrink-0'>
								{yearLabels.map((year, yearIndex) => (
									<div
										key={`year-${year}`}
										className='h-4 mb-2 flex items-center'
										style={{
											marginTop: yearIndex === 0 ? '0' : '0',
										}}
									>
										{year}
									</div>
								))}
							</div>

							{/* Calendar squares */}
							<div
								className='grid gap-2'
								style={{
									display: 'grid',
									gridTemplateColumns: 'repeat(52, minmax(0, 4fr))',
									gridTemplateRows: `repeat(${Math.ceil(
										totalWeeks / 52
									)}, 1fr)`,
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
				</div>
			)}
		</div>
	);
}
