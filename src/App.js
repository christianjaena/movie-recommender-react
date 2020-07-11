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
					async ({ id, title, overview, release_date, poster_path }) => {
						const trailer = await getTrailer(id);
						const poster = `https://image.tmdb.org/t/p/w300/${poster_path}`;
						return {
							id,
							title,
							overview,
							release_date,
							poster,
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
		<div className='App'>
			{isLoaded
				? movies.map(
						({ id, title, overview, poster, release_date, trailer }) => {
							return (
								<div key={id}>
									<img src={poster} alt='poster' />
									<h1>{title}</h1>
									<h3>{release_date}</h3>
									<p>{overview}</p>
									{trailer ? (
										<iframe
											title='trailer'
											width='420'
											height='315'
											src={trailer}
										></iframe>
									) : (
										<h1>No trailer for this movie yet</h1>
									)}
								</div>
							);
						}
				  )
				: null}
		</div>
	);
};

export default App;
