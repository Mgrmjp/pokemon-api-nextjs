import React, { useState, useEffect } from "react";
import styles from "../css/styles.module.css";
import Evolution from "../components/evolution";
import Head from "next/head";

export default function Home() {
  const [name, setName] = useState("magikarp");

  const [id, setId] = useState(0);

  const [sprite, setSprite] = useState("");

  const [spriteShiny, setSpriteShiny] = useState("");

  const [abilities, setAbilities] = useState([]);

  const [type, setType] = useState("");

  const [color, setColor] = useState("");

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

  const abilitiesList = abilities.map((item, index) => (
    <li key={index}>{item.ability.name}</li>
  ));

  return (
    <>
      <Head>
        <title>Pokemon API testing</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div className={styles.page}>
        <div className={styles.mainContainer}>
          <h1 className={styles.pokeName}>{name}</h1>

          <h1 style={{ backgroundColor: color }} className={styles.pokemonType}>
            {type}
          </h1>

          <div className={styles.spriteRow}>
            <div className={styles.spriteContainer}>
              <img style={{ width: "250px" }} src={sprite} />

              <img style={{ width: "250px" }} src={spriteShiny} />
            </div>
          </div>

          <ul className={styles.abilityList}>{abilitiesList}</ul>

          <Evolution pokemonId={id} />
        </div>
      </div>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </>
  );
}
