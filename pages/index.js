import React, { useState, useEffect } from "react";
import styles from "../css/styles.module.css";
import Evolution from "../components/evolution";
import Head from "next/head";

export default function Home() {
  const [name, setName] = useState("bulbasaur");
  const [id, setId] = useState(0);
  const [sprite, setSprite] = useState("");
  const [spriteShiny, setSpriteShiny] = useState("");
  const [abilities, setAbilities] = useState([]);
  const [type, setType] = useState("");
  const [color, setColor] = useState("red");

  const typeHexCodes = {
    grass: "#78C850",
    poison: "#A040A0",
    fire: "#F08030",
    flying: "#A890F0",
    water: "#6890F0",
    bug: "#A8B820",
    normal: "#A8A878",
    electric: "#F8D030",
    ground: "#E0C068",
    fairy: "#EE99AC",
    fighting: "#C03028",
    psychic: "#F85888",
    rock: "#B8A038",
    ice: "#98D8D8",
    dragon: "#7038F8",
    ghost: "#705898",
    dark: "#705848",
    steel: "#B8B8D0",
  };

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon/" + name)
      .then(function (response) {
        if (response.status !== 200) {
          console.log(
            "Looks like there was a problem. Status Code: " + response.status
          );
          return;
        }

        response.json().then(function (data) {
          setName(data.name);

          console.log(data);

          setId(data.id);
          setSprite(data.sprites.front_default);
          setSpriteShiny(data.sprites.front_shiny);
          setAbilities(data.abilities);
          setType(data.types[0].type.name);
        });

        console.log(type);

        if (type.length > 0) {
          if (type == "water") {
            setColor("#0b7fbd");
          }
        }
      })
      .catch(function (err) {
        console.log("Fetch Error :-S", err);
      });
  }, []);

  let abilitiesList = "";

  const abilitiesListPromise = Promise.all(
    abilities.map((item, index) => {
      const url = `https://pokemondb.net/ability/${item.ability.name}`;
      const className = 'grid-col';

      return fetchDataAndExtractFirstParagraph(url, className)
        .then(extractedText => <li key={index}>{item.ability.name} - {extractedText}</li>);
    })
  );

  // Later in your code, when you need the resolved abilitiesList
  abilitiesListPromise.then(abilitiesList => {
    abilitiesList = abilitiesList;
  });

  async function fetchDataAndExtractFirstParagraph(url, className) {
    try {
      const response = await fetch(url);

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
      const firstParagraph = doc.querySelector(`.${className} p:first-of-type`);

      const extractedText = firstParagraph?.textContent.trim() || '';
      console.log(extractedText);

      return extractedText;
    } catch (error) {
      console.error('Error:', error.message);
    }
  }

  return (
    <>
      <Head>
        <title>Pokemon API testing</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div className={styles.page}>
        <div className={styles.mainContainer}>
          <h1 className={styles.pokeName}>{name}</h1>

          <span
            style={{ backgroundColor: typeHexCodes[type] + "80" }}
            className={styles.pokemonType}
          >
            {type}
          </span>

          <div className={styles.spriteRow}>
            <div className={styles.spriteContainer}>
              <img style={{ width: "200px" }} src={sprite} />

              <img style={{ width: "200px" }} src={spriteShiny} />
            </div>
          </div>

          <ul className={styles.abilityList}>{abilitiesList}</ul>

          <Evolution pokemonId={id} />
        </div>
      </div>
    </>
  );
}
