import { IconButton, Tooltip } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { useTranslation } from '../../i18n';
import styles from '../FilterBar.module.css';

interface ClearFiltersButtonProps {
  onClick: () => void;
}

export function ClearFiltersButton({ onClick }: ClearFiltersButtonProps) {
  const { t } = useTranslation();

  return (
    <Tooltip title={t('clearAllFilters')}>
      <IconButton
        onClick={onClick}
        color="primary"
        className={styles.clearButton}
      >
        <FilterAltIcon />
      </IconButton>
    </Tooltip>
  );
}
