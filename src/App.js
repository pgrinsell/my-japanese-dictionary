import '@fontsource/inter';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import { useState, useEffect } from 'react';
import data from './data.json';
import parse from 'html-react-parser';
import Grid from '@mui/joy/Grid';
import SearchBar from './SearchBar';

// function handleAddFuriGana(text) {
//   // todo replace the whole block between perenthesis to avoid orphaned tags
//   return parse(`<ruby>${text.replaceAll('(', '<rt>').replaceAll(')', '</rt>')}</ruby>`);
// }

function ResultCard({ en, kanji, kana }) {
  return (
    <Card>
      <Grid container spacing={4}>
        <Grid sx={{ width: 200 }}>
          <Typography level="h2" sx={{ fontWeight: 'normal' }}>
            {/* {handleAddFuriGana(result.jp)} */}
            <ruby>
              {kanji}
              <rt>{kana}</rt>
            </ruby>
          </Typography>
        </Grid>
        <Grid>
          <Typography>
            {en}
          </Typography>
        </Grid>
      </Grid>
    </Card>
  );
}

function App() {
  const [search, setSearch] = useState({ value: '', mode: '' });
  const [results, setResults] = useState([]);

  useEffect(() => {
    const { value, mode } = search;

    if (Boolean(value)) {
      if (mode === 'en') {
        // todo implement more complex search
        setResults(data.filter(({ en }) => en.toLocaleLowerCase().includes(value.toLocaleLowerCase())));
      } else if (mode === 'jp') {
        setResults(data.filter(({ kanji, kana }) => kanji.includes(value) || kana.includes(value)));
      }
    }
  }, [search]);

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
