import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useTranslation } from '../../i18n';
import styles from '../FilterBar.module.css';

interface TypeFilterSelectProps {
  value: string;
  types: string[];
  onChange: (value: string) => void;
}

export function TypeFilterSelect({ value, types, onChange }: TypeFilterSelectProps) {
  const { t } = useTranslation();

  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value);
  };

  return (
    <FormControl size="small" className={styles.typeFilter}>
      <InputLabel id="type-filter-label">{t('typeLabel')}</InputLabel>
      <Select
        labelId="type-filter-label"
        id="type-filter"
        value={value}
        label={t('typeLabel')}
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>{t('allTypes')}</em>
        </MenuItem>
        {types.map((type) => (
          <MenuItem key={type} value={type}>
            {type}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
