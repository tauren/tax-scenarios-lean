import React from 'react';
import { Button } from '@/components/ui/button';

interface ViewActionsProps {
  onEdit: any;
  onBack: any;
}

const ViewActions: React.FC<ViewActionsProps> = ({ onEdit, onBack }) => (
  <div className="flex gap-2 justify-end mb-2">
    <Button variant="outline" onClick={onBack}>Back to Scenarios</Button>
    <Button onClick={onEdit}>Edit Scenario</Button>
  </div>
);

export default ViewActions; 