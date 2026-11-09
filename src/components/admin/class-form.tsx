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
  Description,
  FieldError,
  Form,
  Input,
  Label,
  Switch,
  TextArea,
  TextField,
  TimeField,
} from "@heroui/react";
import { useAdmin } from "@/hooks/use-admin";
import { Panel } from "@/components/admin/ui";
import type { ClassSession } from "@/types";

type Errors = Partial<
  Record<"title" | "teacher" | "date" | "time" | "duration" | "capacity" | "price" | "description", string>
>;

function timeString(t: Time) {
  return `${String(t.hour).padStart(2, "0")}:${String(t.minute).padStart(2, "0")}`;
}

/** Create or edit an in-person class. Existing classes save as edits. */
export function ClassForm({ initial }: { initial?: ClassSession }) {
  const router = useRouter();
  const { state, update, masjidId } = useAdmin();

  const taken = initial ? initial.takenSeats + (state.bookings[initial.id] ?? 0) : 0;
  const isFreeInitial = !initial || initial.price === "Free";

  const [title, setTitle] = useState(initial?.title ?? "");
  const [teacher, setTeacher] = useState(initial?.teacher ?? "");
  const [date, setDate] = useState<CalendarDate | null>(initial ? parseDate(initial.date) : null);
  const [time, setTime] = useState<Time | null>(initial ? (parseTime(initial.time) as Time) : null);
  const [duration, setDuration] = useState(String(initial?.durationMinutes ?? 60));
  const [capacity, setCapacity] = useState(String(initial?.capacity ?? 20));
  const [free, setFree] = useState(isFreeInitial);
  const [price, setPrice] = useState(isFreeInitial ? "" : (initial?.price ?? "").replace(/[^0-9]/g, ""));
  const [audience, setAudience] = useState(initial?.audience ?? "Everyone");
  const [bring, setBring] = useState(initial?.bring ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [errors, setErrors] = useState<Errors>({});

  const errorCount = Object.values(errors).filter(Boolean).length;
  const clear = (key: keyof Errors) => setErrors((e) => ({ ...e, [key]: undefined }));
  const digits = (v: string) => v.replace(/[^0-9]/g, "");

  function save() {
    const found: Errors = {};
    if (!title.trim()) found.title = "Add a title, e.g. Tajwīd circle — beginners.";
    if (!teacher.trim()) found.teacher = "Add the teacher’s name.";
    if (!date) found.date = "Pick a date.";
    if (!time) found.time = "Add a start time, e.g. 19:30.";
    if (!Number(duration)) found.duration = "Enter the length in minutes, e.g. 60.";
    const cap = Number(capacity);
    if (!cap) found.capacity = "Enter how many seats there are, e.g. 20.";
    else if (cap < taken)
      found.capacity = `${taken} seats are already booked — capacity can’t be lower than that.`;
    if (!free && !Number(price)) found.price = "Enter a price in rand, or switch to free.";
    if (!description.trim()) found.description = "Write at least one line about what to expect.";
    setErrors(found);
    if (Object.keys(found).length > 0 || !date || !time) return;

    const fields = {
      title: title.trim(),
      teacher: teacher.trim(),
      date: date.toString(),
      time: timeString(time),
      durationMinutes: Number(duration),
      capacity: cap,
      price: free ? "Free" : `R${Number(price)}`,
      audience: audience.trim() || "Everyone",
      description: description.trim(),
      bring: bring.trim() || undefined,
    };

    if (initial) {
      update({ classEdits: { ...state.classEdits, [initial.id]: { ...state.classEdits[initial.id], ...fields } } });
    } else {
      const id = `${fields.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${Date.now().toString(36)}`;
      const session: ClassSession = { ...fields, id, masjidId, takenSeats: 0 };
      update({ customClasses: [...state.customClasses, session] });
    }
    router.push("/admin/classes");
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
            <Input placeholder="Tajwīd circle — beginners" />
            <FieldError>{errors.title}</FieldError>
          </TextField>

          <TextField
            value={teacher}
            onChange={(v) => {
              setTeacher(v);
              clear("teacher");
            }}
            isInvalid={Boolean(errors.teacher)}
            className="flex flex-col gap-2"
          >
            <Label>Teacher</Label>
            <Input placeholder="Qari Yusuf Hendricks" />
            <FieldError>{errors.teacher}</FieldError>
          </TextField>

          <TextField value={audience} onChange={setAudience} className="flex flex-col gap-2">
            <Label>Who it’s for</Label>
            <Input placeholder="Brothers, ages 14 and up" />
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
              <Calendar aria-label="Class date">
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

          <TextField
            value={duration}
            onChange={(v) => {
              setDuration(digits(v));
              clear("duration");
            }}
            isInvalid={Boolean(errors.duration)}
            className="flex flex-col gap-2"
          >
            <Label>Length (minutes)</Label>
            <Input inputMode="numeric" />
            <FieldError>{errors.duration}</FieldError>
          </TextField>

          <TextField
            value={capacity}
            onChange={(v) => {
              setCapacity(digits(v));
              clear("capacity");
            }}
            isInvalid={Boolean(errors.capacity)}
            className="flex flex-col gap-2"
          >
            <Label>Seats</Label>
            <Input inputMode="numeric" />
            {errors.capacity ? (
              <FieldError>{errors.capacity}</FieldError>
            ) : (
              initial && <Description>{taken} booked so far.</Description>
            )}
          </TextField>

          <div className="flex flex-col gap-3">
            <Switch isSelected={free} onChange={setFree} className="flex items-center gap-3">
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
              <Switch.Content>
                <Label>Free to attend</Label>
              </Switch.Content>
            </Switch>
            {!free && (
              <TextField
                value={price}
                onChange={(v) => {
                  setPrice(digits(v));
                  clear("price");
                }}
                isInvalid={Boolean(errors.price)}
                className="flex flex-col gap-2"
              >
                <Label>Price per seat (R)</Label>
                <Input inputMode="numeric" placeholder="60" />
                <FieldError>{errors.price}</FieldError>
              </TextField>
            )}
          </div>

          <TextField value={bring} onChange={setBring} className="flex flex-col gap-2">
            <Label>What to bring (optional)</Label>
            <Input placeholder="Your own muṣḥaf" />
          </TextField>

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
            <TextArea rows={5} placeholder="What will people learn, and what level is it?" />
            <FieldError>{errors.description}</FieldError>
          </TextField>
        </div>
      </Panel>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onPress={() => router.push("/admin/classes")}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {initial ? "Save changes" : "Publish class"}
        </Button>
      </div>
    </Form>
  );
}
