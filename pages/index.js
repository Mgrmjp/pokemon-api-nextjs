import React, { useState, useEffect } from 'react';
import styles from '../css/styles.module.css';
import Evolution from '../components/evolution';
import Head from 'next/head'


export default function Home() {

  const [name, setName] = useState('mudkip');

  const [id, setId] = useState(0);

  const [sprite, setSprite] = useState('');

  const [spriteShiny, setSpriteShiny] = useState('');

  const [abilities, setAbilities] = useState([]);

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon/' + name)
    .then(
      function(response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }

        response.json().then(function(data) {
          setName(data.name)

          console.log(data.id)

          setId(data.id)

          setSprite(data.sprites.front_default)

          setSpriteShiny(data.sprites.front_shiny)

          setAbilities(data.abilities)
        });
      }
    )
    .catch(function(err) {
      console.log('Fetch Error :-S', err);
    });
  }, []);

  const abilitiesList = abilities.map((item, index) =>
    <li key={index}>{item.ability.name}</li>
  );

  return (
    <>

      <Head>
        <title>Pokemon API testing</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div className={styles.mainContainer}>

        <h1 className={styles.pokeName}>{name}</h1>

        <div className={styles.spriteContainer}>

          <img style={{width: "200px"}} src={sprite} />

          <img style={{width: "200px"}} src={spriteShiny} />

        </div>

        <ul className={styles.abilityList}>{abilitiesList}</ul>

        <Evolution pokemonId={id} />

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
  )
}
