"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Time, today, getLocalTimeZone, type CalendarDate } from "@internationalized/date";
import {
  Alert,
  Button,
  Calendar,
  CloseButton,
  DateField,
  DatePicker,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  ListBox,
  Radio,
  RadioGroup,
  Select,
  Switch,
  TextArea,
  TextField,
  TimeField,
} from "@heroui/react";
import { useUserState } from "@/hooks/use-user-state";
import type { Event } from "@/types";

const WHERE = [
  "Main hall",
  "Ladies’ section, upstairs",
  "Courtyard",
  "Madrasah classroom",
  "Yard behind the hall",
];

const DRAFT_KEY = "masjidlove.eventDraft";

type Errors = { title?: string; date?: string; time?: string; description?: string };

export default function NewEventPage() {
  const router = useRouter();
  const [state, update] = useUserState();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState<CalendarDate | null>(null);
  const [time, setTime] = useState<Time | null>(null);
  const [where, setWhere] = useState<string>(WHERE[0]);
  const [description, setDescription] = useState("");
  const [audience, setAudience] = useState("everyone");
  const [repeat, setRepeat] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [draftSaved, setDraftSaved] = useState(false);

  const errorCount = Object.values(errors).filter(Boolean).length;
  const masjidId = state.followedMasjidIds[0] ?? "masjidul-quds";

  function validate(): Errors {
    const next: Errors = {};
    if (!title.trim()) next.title = "Add a title, e.g. Ladies’ Qurʾān class.";
    if (!date) next.date = "Pick a date.";
    if (!time) next.time = "Add a start time, e.g. 10:30.";
    if (!description.trim())
      next.description = "Write at least one line so people know what to expect.";
    return next;
  }

  function publish() {
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0 || !date || !time) return;
    const event: Event = {
      id: `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${Date.now().toString(36)}`,
      title: title.trim(),
      date: date.toString(),
      time: `${String(time.hour).padStart(2, "0")}:${String(time.minute).padStart(2, "0")}`,
      masjidId,
      kind: repeat ? "Weekly" : undefined,
      description: description.trim(),
      whereNote: where,
      goingCount: 0,
      maybeCount: 0,
    };
    update({ customEvents: [...state.customEvents, event] });
    router.push(`/events/${event.id}`);
  }

  function saveDraft() {
    try {
      window.localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ title, date: date?.toString(), description, where })
      );
    } catch {}
    setDraftSaved(true);
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex h-11 flex-none items-center px-4">
        <CloseButton aria-label="Close" onPress={() => router.push("/admin")} />
      </header>

      <Form
        validationBehavior="aria"
        onSubmit={(e) => {
          e.preventDefault();
          publish();
        }}
        className="flex flex-1 flex-col"
      >
        <main className="flex flex-1 flex-col gap-5 px-4 pb-4 pt-2">
          <h1 className="text-[28px] font-bold leading-tight tracking-[-0.02em]">
            New event
          </h1>

          {errorCount > 0 && (
            <Alert status="danger">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>
                  {errorCount === 1
                    ? "One thing needs fixing before you can publish."
                    : `${errorCount === 2 ? "Two" : errorCount === 3 ? "Three" : "Four"} things need fixing before you can publish.`}
                </Alert.Title>
              </Alert.Content>
            </Alert>
          )}
          {draftSaved && errorCount === 0 && (
            <Alert status="accent">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>Draft saved on this device.</Alert.Title>
              </Alert.Content>
            </Alert>
          )}

          <TextField
            value={title}
            onChange={(v) => {
              setTitle(v);
              setErrors((e) => ({ ...e, title: undefined }));
            }}
            isInvalid={Boolean(errors.title)}
            className="flex flex-col gap-2"
          >
            <Label>Title</Label>
            <Input placeholder="Ladies’ Qurʾān class" />
            <FieldError>{errors.title}</FieldError>
          </TextField>

          <DatePicker
            value={date}
            onChange={(v) => {
              setDate(v);
              setErrors((e) => ({ ...e, date: undefined }));
            }}
            minValue={today(getLocalTimeZone())}
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
                  <Calendar.GridBody>
                    {(d) => <Calendar.Cell date={d} />}
                  </Calendar.GridBody>
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
              setErrors((e) => ({ ...e, time: undefined }));
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

          <TextField
            value={description}
            onChange={(v) => {
              setDescription(v);
              setErrors((e) => ({ ...e, description: undefined }));
            }}
            isInvalid={Boolean(errors.description)}
            className="flex flex-col gap-2"
          >
            <Label>Description</Label>
            <TextArea
              rows={4}
              placeholder="What should people know before they come?"
            />
            <FieldError>{errors.description}</FieldError>
          </TextField>

          <RadioGroup value={audience} onChange={setAudience}>
            <Label>Who can come</Label>
            <Radio value="everyone" className="flex min-h-[44px] items-center gap-3">
              <Radio.Control>
                <Radio.Indicator />
              </Radio.Control>
              <Radio.Content>
                <Label>Everyone</Label>
              </Radio.Content>
            </Radio>
            <Radio value="followers" className="flex min-h-[44px] items-center gap-3">
              <Radio.Control>
                <Radio.Indicator />
              </Radio.Control>
              <Radio.Content>
                <Label>Followers of this masjid only</Label>
              </Radio.Content>
            </Radio>
          </RadioGroup>

          <Switch isSelected={repeat} onChange={setRepeat} className="flex items-center gap-3">
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
            <Switch.Content>
              <Label>Repeat weekly</Label>
              <Description>Shown as “Weekly” on the event card.</Description>
            </Switch.Content>
          </Switch>
        </main>

        <footer className="sticky bottom-0 flex gap-3 bg-background px-4 pb-8 pt-2">
          <Button variant="outline" size="lg" className="flex-1" onPress={saveDraft}>
            Save draft
          </Button>
          <Button type="submit" variant="primary" size="lg" className="flex-1">
            Publish
          </Button>
        </footer>
      </Form>
    </div>
  );
}
