import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Pokemon, getAll, getByName } from "./API";
import "./styles.css";

interface PokemonWithPower extends Pokemon {
  power: number;
}

const calculatePower = (pokemon: Pokemon) =>
  pokemon.hp +
  pokemon.attack +
  pokemon.defense +
  pokemon.special_attack +
  pokemon.special_defense +
  pokemon.speed;

////////////////////////////////////
let tableRenderCount = 0;
const PokemonTable: React.FunctionComponent<{
  pokemon: PokemonWithPower[];
}> = ({ pokemon }) => {
  console.log(`Table render count:  ${tableRenderCount++}`);
  return (
    <table>
      <thead>
        <tr>
          <td>ID</td>
          <td>Name</td>
          <td>Type</td>
          <td colSpan={6}>Stats</td>
          <td>Power</td>
        </tr>
      </thead>
      <tbody>
        {pokemon.map((p) => (
          <tr key={p.id}>
            <td>{p.id}</td>
            <td>{p.name}</td>
            <td>{p.type.join(", ")}</td>
            <td>{p.hp}</td>
            <td>{p.attack}</td>
            <td>{p.defense}</td>
            <td>{p.special_attack}</td>
            <td>{p.special_defense}</td>
            <td>{p.speed}</td>
            <td>{p.power}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

////////////////////////////////////
const MemoizedPokemonTable = React.memo(PokemonTable);

////////////////////////////////////
let appRenderCount = 0;
export default function App() {
  console.log(`App render count:  ${appRenderCount++}`);

  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [threshold, setThreshold] = useState<number>(0);
  const [search, setSearch] = useState<string>('');

  /////////FETCHING DATA////////////
  useEffect(() => {
    getByName(search).then(setPokemon);
  }, [search]);

  /////////CALCULATING POWER///////
  const pokemonWithPower = useMemo(
    () =>
      pokemon.map((p) => ({
        ...p,
        power: calculatePower(p),
      })),
    [pokemon]
  );

  ////////THRESHOLD///////////////
  const countOverThreshold = useMemo(
    () => pokemonWithPower.filter((p) => p.power > threshold).length,
    [pokemonWithPower, threshold]
  );

  const onSetThreshold = useCallback((e) => {
    let value = e.target.value;
    if (value === "") {
      setThreshold(0);
    } else {
      setThreshold(parseInt(value, 10));
    }
  }, []);

  //////////SEARCH///////////////
  const onSetSearch = useCallback((e) => {
    setSearch(e.target.value);
  },[])
  

  /////////MIN AND MAX////////////
  const min = useMemo(
    () => Math.min(...pokemonWithPower.map((p) => p.power)),
    [pokemonWithPower]
  );
  const max = useMemo(
    () => Math.max(...pokemonWithPower.map((p) => p.power)),
    [pokemonWithPower]
  );

  /////////////////////////////////

  return (
    <div>
      <div className="top-bar">
        <div>Search</div>
        <input type="text" value={search} onChange={onSetSearch}></input>
        <div>Power threshold</div>
        <input type="text" value={threshold} onChange={onSetThreshold}></input>
        <div>Count over threshold: {countOverThreshold}</div>
      </div>
      <div className="two-column">
        <MemoizedPokemonTable pokemon={pokemonWithPower} />
        <div>
          <div>Min: {min}</div>
          <div>Max: {max}</div>
        </div>
      </div>
    </div>
  );
}
