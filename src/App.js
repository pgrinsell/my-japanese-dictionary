import '@fontsource/inter';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import Input from '@mui/joy/Input';
import { useState, useEffect, useRef } from 'react';
import { toKana, isKana } from 'wanakana';
import Search from '@mui/icons-material/Search';
import data from './data.json';
import parse from 'html-react-parser';

function SearchBar({ onSearch }) {
  const [value, setValue] = useState('');
  const [mode, setMode] = useState('en');
  const ref = useRef();

  function handleSetValue(newValue) {
    console.log(`isKana: ${isKana(newValue)}`);

    if (mode === 'jp') {
      const valueAsKana = toKana(newValue, { IMEMode: true });
      setValue(valueAsKana);
    } else {
      setValue(newValue);
    }
  }
  
  function handleSearch(event) {
    event.preventDefault();
    onSearch(value);
    setValue('');
  }

  function handleChangeMode() {
    setMode(currentMode => currentMode === 'en' ? 'jp' : 'en');
    setValue('');
    ref.current.focus();
  }

  return (
    <form onSubmit={handleSearch}>
      <Input
        slotProps={{ input: { ref } }}
        size="lg"
        variant="outlined"
        placeholder="Search for a word or phrase..."
        autoFocus
        value={value}
        onChange={e => handleSetValue(e.target.value)}
        startDecorator={(
          <Button
            variant="soft"
            // color="neutral"
            onClick={e => handleChangeMode(e)}
          >
            {mode === 'en' ? 'EN -> JP' : 'JP -> EN'}
          </Button>
        )}
        endDecorator={(
          <Button variant="plain" type="submit">
            <Search />
          </Button>
        )}
      />
    </form>
  );
}

function handleAddFuriGana(text) {
  // todo replace the whole block between perenthesis to avoid orphaned tags

  const processedText = text
    .replaceAll('(', '<rt>')
    .replaceAll(')', '</rt>');

  return parse(`<ruby>${processedText}</ruby>`);
}

function App() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (Boolean(search)) {
      // setResults([search, ...results]);
      // todo implement more complex search
      setResults(data.filter(({ en }) => en === search));
    }
  }, [search]);

  return (
    <CssVarsProvider>
      <CssBaseline />
      <Stack spacing={2} sx={{ m: 2 }}>
        <SearchBar onSearch={value => setSearch(value)} />
        {results.length > 0 ? results.map((result, i) => (
          <Card key={i}>
            <Typography>
              {handleAddFuriGana(result.jp)}
            </Typography>
            <Typography>
              {result.en}
            </Typography>
            <Typography>
              {result.type}
            </Typography>
          </Card>
        )) : (
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
