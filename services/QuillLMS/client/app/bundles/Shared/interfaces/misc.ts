export interface UserIdsForEvent {
  studentId: number,
  teacherId: number
}

export interface NumberFilterInputProps {
  handleChange: Function;
  label: string;
  column: {
    filterValue: string;
    id: string;
  }
}
