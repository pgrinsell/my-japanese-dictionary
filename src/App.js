import '@fontsource/inter';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Card from '@mui/joy/Card';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import { useState, useEffect } from 'react';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import SearchBar from './SearchBar';
import data from './jmdict-eng-common-3.5.0.json';

const { words } = data;

function Reading({ kanji, kana }) {
  if (kanji.length > 0) {
    // todo ignoring other kanji/kana forms for now

    return (
      <ruby>
        {kanji[0]}
        <rt>{kana[0]}</rt>
      </ruby>
    );
  }

  return kana[0];
};

function ResultCard({ kanji, kana, definitions }) {
  return (
    <Card>
      <Typography level="h2" sx={{ fontWeight: 'normal' }}>
        <Reading kanji={kanji} kana={kana} />
      </Typography>
      <List component="ol" marker="decimal">
        {definitions.map((d, i) => (
          <ListItem key={i}>{d}</ListItem>
        ))}
      </List>
    </Card>
  );
}

function handleSearch(mode, value) {
  let results = [];

  if (Boolean(value)) {

    // todo implement more inteligent search, it currently has several problems:
    // 1. if search has many results it will lag returning a large data set (could be fixed with lazy loading/pagination)
    // 2. basic include will mean the term "hello" returns words relating to "othello" for example
    //    this could ignore partial matches on the data side so "hello" must be at the beginning or preceeded by a space
    // 3. the order does not relate to how exact/good/common the match is, for example the first result for "hello" is "どうも" instead of "こんにちは"
    //    this could take into account the definition number, i.e. highest priority for definition 1

    if (mode === 'en') {
      const lcValue = value.toLocaleLowerCase();
      results = words.filter(word => word.sense.some(({ gloss }) => gloss.some(({ text }) => text.includes(lcValue))));
    } else if (mode === 'jp') {
      results = words.filter(({ kanji, kana }) => kanji.some(({ text }) => text.includes(value)) || kana.some(({ text }) => text.includes(value)));
    }
  }

  return results
    .map(({ kanji, kana, sense }) => ({
      kanji: kanji.map(({ text }) => text),
      kana: kana.map(({ text }) => text),
      definitions: sense.map(({ gloss }) => gloss.map(({ text }) => text).join(', '))
    }));
};

function App() {
  const [search, setSearch] = useState({ value: '', mode: '' });
  const [results, setResults] = useState([]);

  useEffect(() => {
    const { value, mode } = search;
    const results = handleSearch(mode, value);
    setResults(results);
  }, [search]);

  useEffect(() => {
    console.log(results);
  }, [results]);

  return (
    <CssVarsProvider defaultMode="system">
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
