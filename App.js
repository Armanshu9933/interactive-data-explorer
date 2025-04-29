import React, { useState, useEffect } from 'react';
import { fetchPokemons } from './services/api';
import PokemonCard from './components/PokemonCard';
import SearchBar from './components/SearchBar';
import TypeFilter from './components/TypeFilter';
import Loading from './components/Loading';
import NoResults from './components/NoResults';
import './styles/App.css';

function App()
{
    const [pokemons, setPokemons] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() =>
    {
        async function getData()
        {
            try
            {
                const data = await fetchPokemons();
                setPokemons(data);
            }
            catch (err)
            {
                setError('Failed to fetch Pokémon');
            }
            finally
            {
                setLoading(false);
            }
        }
        
        getData();
    }, []);

    const filteredPokemons = pokemons.filter((pokemon) =>
    {
        const matchesSearch = pokemon.name.includes(searchTerm.toLowerCase());
        const matchesType = selectedType
            ? pokemon.types.some((t) => t.type.name === selectedType)
            : true;
        return matchesSearch && matchesType;
    });

    const allTypes = Array.from(
        new Set(
            pokemons.flatMap((p) => p.types.map((t) => t.type.name))
        )
    );

    if (loading)
    {
        return <Loading />;
    }

    if (error)
    {
        return <div>{error}</div>;
    }

    return (
        <div className="app">
            <header>
                <h1>Interactive Data Explorer</h1>
            </header>
            <div className="controls">
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                <TypeFilter types={allTypes} selectedType={selectedType} setSelectedType={setSelectedType} />
            </div>
            <div className="pokemon-list">
                {filteredPokemons.length > 0 ? (
                    filteredPokemons.map((pokemon) => (
                        <PokemonCard key={pokemon.id} pokemon={pokemon} />
                    ))
                ) : (
                    <NoResults />
                )}
            </div>
        </div>
    );
}

export default App;
