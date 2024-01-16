import '@fontsource/inter';
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import { useState, useRef } from 'react';
import { toKana } from 'wanakana';
import Search from '@mui/icons-material/Search';

function SearchBar({ onSearch }) {
  const [value, setValue] = useState('');
  const [mode, setMode] = useState('en');
  const ref = useRef();

  function handleSetValue(newValue) {
    if (mode === 'jp') {
      const valueAsKana = toKana(newValue, { IMEMode: true });
      setValue(valueAsKana);
    } else {
      setValue(newValue);
    }
  }
  
  function handleSearch(event) {
    event.preventDefault();
    onSearch(value, mode);
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

export default SearchBar;
