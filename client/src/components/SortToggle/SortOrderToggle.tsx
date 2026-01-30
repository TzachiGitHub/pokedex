import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import type { SortOrder } from '../../types/pokemon';
import { useTranslation } from '../../i18n';
import styles from '../SortToggle.module.css';

interface SortOrderToggleProps {
  value: SortOrder;
  onChange: (value: SortOrder) => void;
}

export function SortOrderToggle({ value, onChange }: SortOrderToggleProps) {
  const { t } = useTranslation();

  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newSort: SortOrder | null
  ) => {
    if (newSort) {
      onChange(newSort);
    }
  };

  return (
    <Box className={styles.sortSection}>
      <Typography variant="body2" color="text.secondary">
        {t('sortByNumber')}
      </Typography>
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={handleChange}
        size="small"
      >
        <ToggleButton value="asc" aria-label={t('ascending')}>
          <ArrowUpwardIcon fontSize="small" />
          <Typography variant="caption" className={styles.sortLabel}>
            {t('ascending')}
          </Typography>
        </ToggleButton>
        <ToggleButton value="desc" aria-label={t('descending')}>
          <ArrowDownwardIcon fontSize="small" />
          <Typography variant="caption" className={styles.sortLabel}>
            {t('descending')}
          </Typography>
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}
