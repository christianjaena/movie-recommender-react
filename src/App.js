import React, { useEffect, useState } from 'react';
import './App.css';

const App = () => {
	const [movies, setMovies] = useState([]);
	const [isLoaded, setIsLoaded] = useState(false);
	useEffect(() => {
		const fetchMovieData = async () => {
			setIsLoaded(false);
			const url =
				'https://api.themoviedb.org/3/trending/movie/week?api_key=baca7fa48dbd930e3a2e880d3a6c4f8a';
			const fetchUrl = await fetch(url);
			const response = await fetchUrl.json();
			const movieArray = await Promise.all(
				response.results.map(
					async ({
						id,
						title,
						overview,
						release_date,
						poster_path,
						backdrop_path,
					}) => {
						const trailer = await getTrailer(id);
						const poster = `https://image.tmdb.org/t/p/original/${poster_path}`;
						const backdrop = `https://image.tmdb.org/t/p/original/${backdrop_path}`;
						return {
							id,
							title,
							overview,
							release_date,
							poster,
							backdrop,
							trailer,
						};
					}
				)
			);
			setMovies(movieArray);
			setIsLoaded(true);
		};
		fetchMovieData();
	}, []);

	const getTrailer = async id => {
		const trailerUrl = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=baca7fa48dbd930e3a2e880d3a6c4f8a&language=en-US`;
		const fetchTrailer = await fetch(trailerUrl);
		const response = await fetchTrailer.json();
		const keyArray = response.results;
		const filteredArray = keyArray.filter(video => video?.type === 'Trailer');
		const youtubeKey = filteredArray[0]?.key;
		return youtubeKey ? `https://www.youtube.com/embed/${youtubeKey}` : '';
	};

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				flexDirection: 'column',
			}}
		>
			{isLoaded
				? movies.map(
						({
							id,
							title,
							overview,
							poster,
							release_date,
							trailer,
							backdrop,
						}) => {
							return (
								<div key={id} style={{ display: 'flex', height: '50%' }}>
									<div
										style={{ padding: '20px', height: '100%', width: '30%' }}
									>
										<img
											src={poster}
											alt='poster'
											style={{
												position: 'relative',
												height: '100%',
												width: '100%',
											}}
										/>
									</div>
									<div
										style={{
											padding: '0 25px 25px 25px',
											width: '70%',
											display: 'flex',
											flexDirection: 'column',
											justifyContent: 'space-between',
										}}
									>
										<div style={{ height: 'auto' }}>
											<p
												style={{
													fontWeight: 'bold',
													fontSize: '2em',
													marginTop: '10px',
												}}
											>
												{title}
											</p>
											<span
												style={{
													height: '100px',
													width: '200px',
													backgroundColor: 'green',
													borderRadius: '20px',
													padding: '15px',
												}}
											>
												<a
													href={`https://yts.mx/movies/${title
														.replace(/\s+/g, '-')
														.replace(/[^-\w]/g, '')
														.toLowerCase()}-${release_date.substring(0, 4)}`}
													target='_blank'
													rel='noopener noreferrer'
													style={{ textDecoration: 'none', color: 'white' }}
												>
													Download
												</a>
											</span>
											<p>{release_date}</p>
											<p>{overview}</p>
										</div>
										<div style={{ height: '70%' }}>
											{trailer ? (
												<iframe
													title='trailer'
													width='100%'
													height='100%'
													src={trailer}
												></iframe>
											) : (
												<h1>No trailer for this movie yet</h1>
											)}
										</div>
									</div>
								</div>
							);
						}
				  )
				: null}
		</div>
	);
};

export default App;
