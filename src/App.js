import '@fontsource/inter';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import { useState, useEffect } from 'react';
// import data from './JMdict_e.json';
// import parse from 'html-react-parser';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import SearchBar from './SearchBar';
import data from './jmdict-eng-common-3.5.0.json';

const { words } = data;

// const entries = data.JMdict.entry;

// function handleAddFuriGana(text) {
//   // todo replace the whole block between perenthesis to avoid orphaned tags
//   return parse(`<ruby>${text.replaceAll('(', '<rt>').replaceAll(')', '</rt>')}</ruby>`);
// }

function Reading({ kanji, kana }) {
  if (kanji) {
    return (
      <ruby>
        {kanji}
        <rt>{kana}</rt>
      </ruby>
    );
  }

  return kana;
};

function ResultCard({ kanji, kana, definitions }) {
  return (
    <Card>
      <Typography level="h2" sx={{ fontWeight: 'normal' }}>
        <Reading kanji={kanji} kana={kana} />
      </Typography>
      <List component="ol" marker="decimal">
        {definitions.map(d => (
          <ListItem>{d}</ListItem>
        ))}
      </List>
    </Card>
  );
}

function handleSearch(mode, value) {
  if (!Boolean(value)) {
    return [];
  }

  if (mode === 'en') {
    const lcValue = value.toLocaleLowerCase();

    return words.filter(word => {
      try {
        const { sense } = word;
        return sense.some(({ gloss }) => gloss.some(({ text }) => text.includes(lcValue)));
      } catch (ex) {
        console.error('error searching entry', ex.message, word);
        return false;
      }
    });

    // todo implement more complex search
  } else if (mode === 'jp') {
    return words.filter(({ kanji, kana }) => kanji.includes(value) || kana.includes(value));
  }
};





function App() {
  const [search, setSearch] = useState({ value: '', mode: '' });
  const [results, setResults] = useState([]);

  useEffect(() => {
    const { value, mode } = search;
    const results = handleSearch(mode, value);
    console.log(results);

    // todo ignoring other kanji/kana forms for now

    const newResults = results.map(({ kanji, kana, sense }) => ({
      kanji: kanji.map(({ text }) => text)[0],
      kana: kana.map(({ text }) => text)[0],
      definitions: sense.map(({ gloss }) => gloss.map(({ text }) => text).join(', '))
    }));

    setResults(newResults);
  }, [search]);

  useEffect(() => {
    console.log(results);
  }, [results]);

  return (
    <CssVarsProvider>
      <CssBaseline />
      <Stack spacing={2} sx={{ m: 2 }}>
        <SearchBar onSearch={(value, mode) => setSearch({ value, mode })} />
        {results.length > 0 && (
          <>
            {results.map((result, i) => (
              <ResultCard key={i} {...result} />
            ))}
          </>
        )}
        {results.length === 0 && (
          <>
            <Typography>
              Search for a world or phrase using the input above. You can switch mode between English to Japanese and Japanese to English. Japanese to English mode supports Kana input.
            </Typography>
            <Typography>
              Your search results will appear in this area.
            </Typography>
          </>
        )}
      </Stack>
    </CssVarsProvider>
  );
}

export default App;
