"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  getLocalTimeZone,
  parseDate,
  parseTime,
  Time,
  today,
  type CalendarDate,
} from "@internationalized/date";
import {
  Alert,
  Button,
  Calendar,
  DateField,
  DatePicker,
  FieldError,
  Form,
  Input,
  Label,
  ListBox,
  Select,
  Switch,
  TextArea,
  TextField,
  TimeField,
} from "@heroui/react";
import { useAdmin } from "@/hooks/use-admin";
import { Panel } from "@/components/admin/ui";
import type { Event } from "@/types";

const WHERE = [
  "Main hall",
  "Ladies’ section, upstairs",
  "Courtyard",
  "Madrasah classroom",
  "Yard behind the hall",
];

type Errors = { title?: string; date?: string; time?: string; description?: string };

function timeString(t: Time) {
  return `${String(t.hour).padStart(2, "0")}:${String(t.minute).padStart(2, "0")}`;
}

/** Create or edit an event. Existing events save as edits so seed data is never mutated. */
export function EventForm({ initial }: { initial?: Event }) {
  const router = useRouter();
  const { state, update, masjidId } = useAdmin();

  const [title, setTitle] = useState(initial?.title ?? "");
  const [date, setDate] = useState<CalendarDate | null>(
    initial ? parseDate(initial.date) : null
  );
  const [time, setTime] = useState<Time | null>(
    initial ? (parseTime(initial.time) as Time) : null
  );
  const [where, setWhere] = useState<string>(initial?.whereNote ?? WHERE[0]);
  const [description, setDescription] = useState(initial?.description ?? "");
  const [repeat, setRepeat] = useState(initial?.kind === "Weekly");
  const [errors, setErrors] = useState<Errors>({});

  const errorCount = Object.values(errors).filter(Boolean).length;
  const clear = (key: keyof Errors) => setErrors((e) => ({ ...e, [key]: undefined }));

  function save() {
    const found: Errors = {};
    if (!title.trim()) found.title = "Add a title, e.g. Ladies’ Qurʾān class.";
    if (!date) found.date = "Pick a date.";
    if (!time) found.time = "Add a start time, e.g. 10:30.";
    if (!description.trim())
      found.description = "Write at least one line so people know what to expect.";
    setErrors(found);
    if (Object.keys(found).length > 0 || !date || !time) return;

    const fields = {
      title: title.trim(),
      date: date.toString(),
      time: timeString(time),
      kind: repeat ? "Weekly" : undefined,
      description: description.trim(),
      whereNote: where,
    };

    if (initial) {
      update({ eventEdits: { ...state.eventEdits, [initial.id]: { ...state.eventEdits[initial.id], ...fields } } });
    } else {
      const id = `${fields.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${Date.now().toString(36)}`;
      const event: Event = { ...fields, id, masjidId, goingCount: 0, maybeCount: 0 };
      update({ customEvents: [...state.customEvents, event] });
    }
    router.push("/admin/events");
  }

  return (
    <Form
      validationBehavior="aria"
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
      className="flex flex-col gap-5"
    >
      {errorCount > 0 && (
        <Alert status="danger">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>
              {errorCount === 1
                ? "One thing needs fixing before you can save."
                : `${errorCount} things need fixing before you can save.`}
            </Alert.Title>
          </Alert.Content>
        </Alert>
      )}

      <Panel>
        <div className="grid gap-5 md:grid-cols-2">
          <TextField
            value={title}
            onChange={(v) => {
              setTitle(v);
              clear("title");
            }}
            isInvalid={Boolean(errors.title)}
            className="flex flex-col gap-2 md:col-span-2"
          >
            <Label>Title</Label>
            <Input placeholder="Ladies’ Qurʾān class" />
            <FieldError>{errors.title}</FieldError>
          </TextField>

          <DatePicker
            value={date}
            onChange={(v) => {
              setDate(v);
              clear("date");
            }}
            minValue={initial ? undefined : today(getLocalTimeZone())}
            isInvalid={Boolean(errors.date)}
            className="flex flex-col gap-2"
          >
            <Label>Date</Label>
            <DateField.Group fullWidth>
              <DateField.Input>
                {(segment) => <DateField.Segment segment={segment} />}
              </DateField.Input>
              <DateField.Suffix>
                <DatePicker.Trigger>
                  <DatePicker.TriggerIndicator />
                </DatePicker.Trigger>
              </DateField.Suffix>
            </DateField.Group>
            <FieldError>{errors.date}</FieldError>
            <DatePicker.Popover>
              <Calendar aria-label="Event date">
                <Calendar.Header>
                  <Calendar.YearPickerTrigger>
                    <Calendar.YearPickerTriggerHeading />
                    <Calendar.YearPickerTriggerIndicator />
                  </Calendar.YearPickerTrigger>
                  <Calendar.NavButton slot="previous" />
                  <Calendar.NavButton slot="next" />
                </Calendar.Header>
                <Calendar.Grid>
                  <Calendar.GridHeader>
                    {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
                  </Calendar.GridHeader>
                  <Calendar.GridBody>{(d) => <Calendar.Cell date={d} />}</Calendar.GridBody>
                </Calendar.Grid>
                <Calendar.YearPickerGrid>
                  <Calendar.YearPickerGridBody>
                    {({ year }) => <Calendar.YearPickerCell year={year} />}
                  </Calendar.YearPickerGridBody>
                </Calendar.YearPickerGrid>
              </Calendar>
            </DatePicker.Popover>
          </DatePicker>

          <TimeField
            value={time}
            onChange={(v) => {
              setTime(v as Time | null);
              clear("time");
            }}
            hourCycle={24}
            isInvalid={Boolean(errors.time)}
            className="flex flex-col gap-2"
          >
            <Label>Start time</Label>
            <TimeField.Group fullWidth>
              <TimeField.Input>
                {(segment) => <TimeField.Segment segment={segment} />}
              </TimeField.Input>
            </TimeField.Group>
            <FieldError>{errors.time}</FieldError>
          </TimeField>

          <Select
            selectedKey={where}
            onSelectionChange={(key) => key && setWhere(String(key))}
            className="flex flex-col gap-2"
          >
            <Label>Where in the masjid</Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {WHERE.map((place) => (
                  <ListBox.Item key={place} id={place} textValue={place}>
                    {place}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>

          <Switch
            isSelected={repeat}
            onChange={setRepeat}
            className="flex items-center gap-3 self-end pb-2"
          >
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
            <Switch.Content>
              <Label>Repeat weekly</Label>
            </Switch.Content>
          </Switch>

          <TextField
            value={description}
            onChange={(v) => {
              setDescription(v);
              clear("description");
            }}
            isInvalid={Boolean(errors.description)}
            className="flex flex-col gap-2 md:col-span-2"
          >
            <Label>Description</Label>
            <TextArea rows={5} placeholder="What should people know before they come?" />
            <FieldError>{errors.description}</FieldError>
          </TextField>
        </div>
      </Panel>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onPress={() => router.push("/admin/events")}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {initial ? "Save changes" : "Publish event"}
        </Button>
      </div>
    </Form>
  );
}
