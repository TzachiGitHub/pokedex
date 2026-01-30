import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { VALID_PAGE_SIZES } from '../../hooks/useUrlState';
import type { PageSize } from '../../types/pokemon';
import { useTranslation } from '../../i18n';
import styles from '../SortToggle.module.css';

interface PageSizeSelectProps {
  value: PageSize;
  onChange: (value: PageSize) => void;
}

export function PageSizeSelect({ value, onChange }: PageSizeSelectProps) {
  const { t } = useTranslation();

  const handleChange = (event: SelectChangeEvent<number>) => {
    onChange(event.target.value as PageSize);
  };

  return (
    <FormControl size="small" className={styles.pageSizeControl}>
      <InputLabel id="page-size-label">{t('show')}</InputLabel>
      <Select
        labelId="page-size-label"
        id="page-size"
        value={value}
        label={t('show')}
        onChange={handleChange}
      >
        {VALID_PAGE_SIZES.map((size) => (
          <MenuItem key={size} value={size}>
            {size}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
