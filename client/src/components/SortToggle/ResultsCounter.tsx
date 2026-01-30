import { Typography } from '@mui/material';
import { useTranslation } from '../../i18n';

interface ResultsCounterProps {
  page: number;
  limit: number;
  totalItems: number;
}

export function ResultsCounter({ page, limit, totalItems }: ResultsCounterProps) {
  const { t } = useTranslation();

  return (
    <Typography variant="body2" color="text.secondary">
      {t('showingResults', {
        shown: Math.min(page * limit, totalItems),
        total: totalItems,
      })}
    </Typography>
  );
}
